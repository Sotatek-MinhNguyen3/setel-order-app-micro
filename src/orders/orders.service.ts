import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ORDER_STATUS } from 'const';
import { Model } from 'mongoose';
import { Order } from './orders.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
  ) {}

  async createOrder(
    uid: string,
    quantity: number,
    priceEach: number,
    status: string,
  ) {
    const newOrder = new this.orderModel({ uid, quantity, priceEach, status });
    try {
      const result = await newOrder.save();
      return result as Order;
    } catch (error) {
      throw new NotFoundException('Failed to save order');
    }
  }

  async getAllOrders() {
    try {
      const orders = await this.orderModel.find().exec();
      return orders;
    } catch (error) {
      throw new NotFoundException('Get orders failed');
    }
  }

  async getOneOrder(orderId: string) {
    const order = await this.findOrder(orderId);
    return order;
  }

  async cancelOrder(orderId: string) {
    const order = await this.findOrder(orderId);
    if (!order) throw new NotFoundException('Order not found');
    order.status = ORDER_STATUS.CANCELLED;
    const result = await order.save();
    return result;
  }

  private async findOrder(prodId: string): Promise<Order> {
    const order = await this.orderModel.findById(prodId).exec();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
