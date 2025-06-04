import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MasterRecord } from './master-record.entity';

@Injectable()
export class MasterRecordService {
  constructor(
    @InjectRepository(MasterRecord)
    private masterRecordRepository: Repository<MasterRecord>,
  ) {}

  async create(masterRecord: Partial<MasterRecord>): Promise<MasterRecord> {
    const newRecord = this.masterRecordRepository.create(masterRecord);
    return await this.masterRecordRepository.save(newRecord);
  }

  async findAll(): Promise<MasterRecord[]> {
    return this.masterRecordRepository.find();
  }
}