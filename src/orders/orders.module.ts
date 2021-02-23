import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import { OrderController } from './orders.controller';
import { OrderSchema } from './orders.model';
import { OrderService } from './orders.service';

@Module({
    imports: [MongooseModule.forFeature([{name: 'Order', schema: OrderSchema}])],
    controllers: [OrderController],
    providers: [OrderService]
})
export class OrderModule {}