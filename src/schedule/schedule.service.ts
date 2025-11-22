import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createScheduleDto: CreateScheduleDto) {
    const schedule = await this.prisma.feedSchedule.create({
      data: createScheduleDto,
    });
    return schedule;
  }

  findAll() {
    return this.prisma.feedSchedule.findMany();
  }

  async remove(id: string) {
    await this.prisma.feedSchedule.delete({
      where: { id },
    });
    return `Deleted schedule with id: ${id}`;
  }
}
