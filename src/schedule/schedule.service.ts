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

  async toggle(id: string) {
    const schedule = await this.prisma.feedSchedule.findUnique({
      where: { id },
      select: { isEnabled: true },
    });

    if (!schedule) {
      throw new Error('Schedule not found');
    }

    const currentStatus = schedule.isEnabled;

    await this.prisma.feedSchedule.update({
      where: { id },
      data: { isEnabled: !currentStatus },
    });

    return 'Toggled schedule with id: ' + id;
  }

  findAll() {
    return this.prisma.feedSchedule.findMany();
  }

  async findEnabled() {
    return this.prisma.feedSchedule.findMany({
      where: {
        isEnabled: true,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.feedSchedule.delete({
      where: { id },
    });
    return `Deleted schedule with id: ${id}`;
  }
}
