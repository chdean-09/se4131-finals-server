import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { PrismaModule } from 'src/prisma.module';
import { ScheduleDispatcherService } from './schedule-dispatcher.service';
import { FeedModule } from 'src/feed/feed.module';

@Module({
  imports: [PrismaModule, FeedModule],
  controllers: [ScheduleController],
  providers: [ScheduleService, ScheduleDispatcherService],
})
export class ScheduleModule {}
