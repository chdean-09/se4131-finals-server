import { IsEnum, IsMilitaryTime } from 'class-validator';

enum DaysOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export class CreateScheduleDto {
  @IsEnum(DaysOfWeek, { each: true })
  days: DaysOfWeek[];

  @IsMilitaryTime()
  time: string;
}
