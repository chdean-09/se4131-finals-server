import { Module } from '@nestjs/common';
import { FeedGateway } from './feed.gateway';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
  providers: [FeedGateway, FeedService],
  controllers: [FeedController],
})
export class EventsModule {}
