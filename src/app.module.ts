import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { OrderModule } from './orders/orders.module';
import {MongooseModule} from '@nestjs/mongoose';
import { AuthenticationMiddleware } from './middleware/authen.middleware';

@Module({
  imports: [OrderModule, MongooseModule.forRoot(`mongodb+srv://minhnguyen:123@123a@cluster0.lfo7s.mongodb.net/setel-order-app?retryWrites=true&w=majority`)],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('/')
  }
}
