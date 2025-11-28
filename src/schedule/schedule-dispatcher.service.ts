import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ScheduleService } from './schedule.service';
import { FeedService } from '../feed/feed.service';
import { WeekDays } from 'generated/prisma/enums';
import { FeedType } from 'src/feed/dto/feed-type.dto';

@Injectable()
export class ScheduleDispatcherService implements OnModuleInit {
  private readonly logger = new Logger(ScheduleDispatcherService.name);
  private lastExecutedSchedules = new Map<string, Date>();

  constructor(
    private scheduleService: ScheduleService,
    private feedService: FeedService,
  ) {}

  onModuleInit() {
    this.logger.log('Schedule Dispatcher Service initialized');
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkSchedules() {
    const now = new Date();
    const currentTime = this.formatTime(now);
    const currentDay = this.getCurrentDay(now);

    this.logger.debug(`Checking schedules at ${currentTime} on ${currentDay}`);

    const enabledSchedules = await this.scheduleService.findEnabled();

    for (const schedule of enabledSchedules) {
      if (schedule.time === currentTime && schedule.days.includes(currentDay)) {
        const lastExecuted = this.lastExecutedSchedules.get(schedule.id);
        const oneMinuteAgo = new Date(now.getTime() - 60000);

        if (!lastExecuted || lastExecuted < oneMinuteAgo) {
          await this.executeSchedule(schedule.id, schedule.time);
          this.lastExecutedSchedules.set(schedule.id, now);
        }
      }
    }

    const twoMinutesAgo = new Date(now.getTime() - 120000);
    for (const [
      scheduleId,
      executionTime,
    ] of this.lastExecutedSchedules.entries()) {
      if (executionTime < twoMinutesAgo) {
        this.lastExecutedSchedules.delete(scheduleId);
      }
    }
  }

  private async executeSchedule(scheduleId: string, time: string) {
    try {
      this.logger.log(
        `Executing scheduled feed at ${time} (Schedule ID: ${scheduleId})`,
      );

      await this.feedService.feedPet({ type: FeedType.SCHEDULED });

      this.logger.log(`Successfully dispensed food for schedule ${scheduleId}`);
    } catch (error) {
      console.error(error);
      this.logger.error(`Failed to execute schedule ${scheduleId}`);
    }
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private getCurrentDay(date: Date): WeekDays {
    const days: WeekDays[] = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ];
    return days[date.getDay()];
  }
}
