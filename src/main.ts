import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microservices = app.connectMicroservice( {
    transport: Transport.TCP,
    options: {
      port: 3000
    }
  });

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  
  await app.startAllMicroservicesAsync();
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
