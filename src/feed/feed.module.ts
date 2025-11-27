import { Module } from '@nestjs/common';
import { FeedGateway } from './feed.gateway';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { PrismaModule } from 'src/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [FeedGateway, FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
