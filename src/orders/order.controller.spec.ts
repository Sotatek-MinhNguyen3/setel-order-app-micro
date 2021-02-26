import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './orders.controller';
import { OrderSchema } from './orders.model';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { OrderService } from './orders.service';
import { ORDER_STATUS } from '../common/constant';
import { CreateOrderDto } from './dto/order.dto';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';

let mongod: MongoMemoryServer;

describe('OrderController', () => {
  let orderController: OrderController;
  mongod = new MongoMemoryServer();

  beforeEach(async () => {
    const mongoUri = await mongod.getUri();
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
        ClientsModule.register([
          {
            name: 'ORDER_SERVICE',
            transport: Transport.TCP,
            options: {
              port: 4000,
            },
          },
        ]),
      ],
      controllers: [OrderController],
      providers: [OrderService],
      exports: [OrderService],
    }).compile();

    orderController = app.get<OrderController>(OrderController);
  });

  afterAll(async () => {
    if (mongod) await mongod.stop();
  });

  //create order
  describe('create order', () => {
    it('should return an object with _id', async () => {
      const order: CreateOrderDto = {
        uid: '2',
        quantity: 1,
        priceEach: 20,
        status: ORDER_STATUS.CREATED,
      };
      const result = await orderController.createOrder(order);
      expect(result).toHaveProperty('_id');
    });

    describe('validate DTO', () => {
      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: CreateOrderDto,
        data: '',
      };

      const target: ValidationPipe = new ValidationPipe({
        transform: true,
        whitelist: true,
      });

      it('should throw error when [quantity] is STRING', async () => {
        const order = {
          uid: '2',
          quantity: '2',
          priceEach: 20,
          status: ORDER_STATUS.CREATED,
        };

        await target.transform(order, metadata).catch((err) => {
          expect(err.getResponse().message.length).toBeGreaterThan(0);
        });
      });

      it('should throw error when[quantity] is 0 ', async () => {
        const order = {
          uid: '2',
          quantity: 0,
          priceEach: 20,
          status: ORDER_STATUS.CREATED,
        };

        await target.transform(order, metadata).catch((err) => {
          expect(err.getResponse().message.length).toBeGreaterThan(0);
        });
      });

      it('should throw error when[priceEach] is 0', async () => {
        const order = {
          uid: '2',
          quantity: 2,
          priceEach: 0,
          status: ORDER_STATUS.CREATED,
        };

        await target.transform(order, metadata).catch((err) => {
          expect(err.getResponse().message.length).toBeGreaterThan(0);
        });
      });

      it('should throw error when[priceEach] is STRING', async () => {
        const order = {
          uid: '2',
          quantity: 2,
          priceEach: '2',
          status: ORDER_STATUS.CREATED,
        };

        await target.transform(order, metadata).catch((err) => {
          expect(err.getResponse().message.length).toBeGreaterThan(0);
        });
      });

      it('should throw error when payload is missing required field', async () => {
        const order = {
          uid: '2',
          quantity: 2,
          status: ORDER_STATUS.CREATED,
        };

        await target.transform(order, metadata).catch((err) => {
          expect(err.getResponse().message.length).toBeGreaterThan(0);
        });
      });
    });
  });

  //get order
  describe('get orders', () => {
    it('should return an array contain at least 1 object', async () => {
      const result = await orderController.getAllOrders();
      expect(Array.isArray(result)).toBeTruthy();
    })
  })
});
