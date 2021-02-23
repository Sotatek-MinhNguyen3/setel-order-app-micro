import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ORDER_API } from 'const';
import { Order } from './orders.model';
import { OrderService } from './orders.service';

@Controller(ORDER_API)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

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
    @Body('uid') uid: string,
    @Body('quantity') quantity: number,
    @Body('priceEach') priceEach: number,
    @Body('status') status: string,
  ) {
    const result = await this.orderService.createOrder(
      uid,
      quantity,
      priceEach,
      status,
    );
    return result as Order;
  }
}
