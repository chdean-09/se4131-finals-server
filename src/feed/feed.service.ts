import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma.service';
import { FeedTypeDto } from './dto/feed-type.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FeedService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    private httpService: HttpService,
  ) {}

  async feedPet(type: FeedTypeDto) {
    this.eventEmitter.emit('dispense', {});

    await this.prisma.feedHistory.create({
      data: type,
    });

    try {
      await firstValueFrom(
        this.httpService.post(
          `http://10.243.194.42/dispense`,
          {},
          {
            timeout: 20000,
          },
        ),
      );
    } catch (error) {
      console.error('Error dispensing food:', error);
    }

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
