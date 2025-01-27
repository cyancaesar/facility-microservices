import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Outbox } from './entities/outbox.entity';

@Injectable()
export class OutboxService {
  constructor(
    @InjectRepository(Outbox)
    private readonly outboxRepository: Repository<Outbox>,
  ) {}

  async getUnprocessedMessages(options: {
    target: string;
    take: number;
  }): Promise<Outbox[]> {
    const { target, take } = options;
    return this.outboxRepository.find({
      where: { target },
      order: {
        createdAt: 'ASC',
      },
      take,
    });
  }
}
