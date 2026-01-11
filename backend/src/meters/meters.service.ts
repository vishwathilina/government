import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meter } from '../database/entities/meter.entity';
import { CreateMeterDto } from './dto/create-meter.dto';
import { UpdateMeterDto } from './dto/update-meter.dto';

@Injectable()
export class MetersService {
  constructor(
    @InjectRepository(Meter)
    private readonly meterRepository: Repository<Meter>,
  ) {}

  async create(createMeterDto: CreateMeterDto): Promise<Meter> {
    const meter = this.meterRepository.create({
      meterSerialNo: createMeterDto.meterNumber,
      utilityTypeId: createMeterDto.utilityTypeId,
      installationDate: createMeterDto.installationDate,
      isSmartMeter: createMeterDto.isSmartMeter,
      status: createMeterDto.status as any,
      // location: createMeterDto.location, // Uncomment if you add location to the entity
    });
    return this.meterRepository.save(meter);
  }

  async findAll(): Promise<Meter[]> {
    return this.meterRepository.find();
  }

  async findOne(id: string | number): Promise<Meter> {
    const meter = await this.meterRepository.findOne({ where: { meterId: Number(id) } });
    if (!meter) throw new NotFoundException('Meter not found');
    return meter;
  }

  async update(id: string | number, updateMeterDto: UpdateMeterDto): Promise<Meter> {
    const meter = await this.findOne(id);
    if (updateMeterDto.meterNumber !== undefined) meter.meterSerialNo = updateMeterDto.meterNumber;
    if (updateMeterDto.utilityTypeId !== undefined) meter.utilityTypeId = updateMeterDto.utilityTypeId;
    if (updateMeterDto.installationDate !== undefined) meter.installationDate = new Date(updateMeterDto.installationDate);
    if (updateMeterDto.isSmartMeter !== undefined) meter.isSmartMeter = updateMeterDto.isSmartMeter;
    if (updateMeterDto.status !== undefined) meter.status = updateMeterDto.status as any;
    return this.meterRepository.save(meter);
  }

  async remove(id: string | number): Promise<void> {
    const meter = await this.findOne(id);
    await this.meterRepository.remove(meter);
  }
}
