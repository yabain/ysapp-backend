import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { MongoExceptionFilter } from './shared/exceptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true,
    transform:true
  }));

  app.enableCors();
  app.useGlobalFilters(new MongoExceptionFilter())
  useContainer(app.select(AppModule),{fallbackOnErrors:true});
  await app.listen(3000);
}
bootstrap();
