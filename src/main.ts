import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { backendDBManager } from './dependency-injection';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { Logger } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  dotenv.config();
  await backendDBManager.connect();


  const app = await NestFactory.create(AppModule);
  const globalPrefix = '/';
  app.setGlobalPrefix(globalPrefix);
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Sambil API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const corsOptions: CorsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  };

  app.enableCors(corsOptions);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  Logger.log(`🚀 Application is running on port: ${port}${globalPrefix}`);
}

bootstrap();
