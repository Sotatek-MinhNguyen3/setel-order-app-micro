import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ORDER_STATUS } from '../common/constant';
import { Model } from 'mongoose';
import { Order } from './orders.model';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
  ) {}

  async createOrder(payload: CreateOrderDto) {
    const { uid, quantity, priceEach, status } = payload;
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
      const orders = await this.orderModel.find({}).sort({ date: -1 }).exec();
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

  async updateOrder(payload: Order) {
    const order = await this.findOrder(payload._id);
    if (!order) throw new NotFoundException('Order not found');
    order.status = payload.status;
    order.save();
  }

  private async findOrder(prodId: string): Promise<Order> {
    const order = await this.orderModel.findById(prodId).exec();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
