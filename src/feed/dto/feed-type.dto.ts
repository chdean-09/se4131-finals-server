import { IsEnum } from 'class-validator';

export enum FeedType {
  SCHEDULED = 'SCHEDULED',
  MANUAL = 'MANUAL',
}

export class FeedTypeDto {
  @IsEnum(FeedType)
  type: FeedType;
}
