import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FeedGateway } from './feed/feed.gateway';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from './schedule/schedule.module';
import { FeedModule } from './feed/feed.module';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    NestScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    ScheduleModule,
    FeedModule,
  ],
  controllers: [AppController],
  providers: [AppService, FeedGateway],
})
export class AppModule {}
