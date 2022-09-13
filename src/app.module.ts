import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './shared/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration]
    }),
    MongooseModule.forRoot(process.env.MONGO_DATABASE_URL)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
