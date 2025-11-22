import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FeedGateway } from './feed/feed.gateway';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    ScheduleModule,
  ],
  controllers: [AppController],
  providers: [AppService, FeedGateway],
})
export class AppModule {}
