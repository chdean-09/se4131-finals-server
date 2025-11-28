import { Module } from '@nestjs/common';
import { FeedGateway } from './feed.gateway';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { PrismaModule } from 'src/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, HttpModule],
  providers: [FeedGateway, FeedService],
  controllers: [FeedController],
  exports: [FeedService],
})
export class FeedModule {}
