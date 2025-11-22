import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma.service';
import { FeedTypeDto } from './dto/feed-type.dto';

@Injectable()
export class FeedService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async feedPet(type: FeedTypeDto) {
    this.eventEmitter.emit('dispense', {});

    await this.prisma.feedHistory.create({
      data: type,
    });
    return 'Food has been dispensed!';
  }

  async findAll() {
    return this.prisma.feedHistory.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
