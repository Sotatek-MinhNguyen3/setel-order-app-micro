import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ORDER_API,
  ORDER_STATUS,
  SERVICE_ORDER,
  SERVICE_PAYMENT,
} from '../common/constant';
import { Order } from './orders.model';
import { OrderService } from './orders.service';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/order.dto';

@Controller(ORDER_API)
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @Inject('ORDER_SERVICE') private readonly client: ClientProxy,
  ) {}
  async onApplicationBootstrap() {
    await this.client.connect();
  }

  //listen for paymetn service
  @EventPattern(SERVICE_ORDER)
  async handleIncomingResult(data) {
    const {status, message} = data;

    if (!status) message.status = ORDER_STATUS.CANCELLED;
    else message.status = ORDER_STATUS.DELIVERED;

    this.orderService.updateOrder(message);
  }

  @Get('/payment/:id')
  async verifyPayment(@Param('id') orderId: string) {
    this.client.emit<any>(SERVICE_PAYMENT, orderId);
  }

  @Get()
  async getAllOrders() {
    const orders = await this.orderService.getAllOrders();
    return orders;
  }

  @Get(':id')
  async getOneOrder(@Param('id') orderId: string) {
    const order = await this.orderService.getOneOrder(orderId);
    return order;
  }

  @Patch(':id')
  async cancelOrder(@Param('id') orderId: string) {
    const result = await this.orderService.cancelOrder(orderId);
    return result;
  }

  @Post()
  async createOrder(
    @Body() body: CreateOrderDto,
  ) {
    const result = await this.orderService.createOrder(body);
    this.client.emit<any>(SERVICE_PAYMENT, result);
    return result as Order;
  }
}
