import { Body, Controller, Get, Post } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedTypeDto } from './dto/feed-type.dto';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @Post()
  create(@Body() type: FeedTypeDto) {
    return this.feedService.feedPet(type);
  }

  @Get()
  findAll() {
    return this.feedService.findAll();
  }
}
