import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { MetersService } from './meters.service';
import { CreateMeterDto } from './dto/create-meter.dto';
import { UpdateMeterDto } from './dto/update-meter.dto';

@Controller('meters')
export class MetersController {
  constructor(private readonly metersService: MetersService) {}

  @Post()
  async create(@Body() createMeterDto: CreateMeterDto) {
    const meter = await this.metersService.create(createMeterDto);
    return this.toDto(meter);
  }

  @Get()
  async findAll() {
    const meters = await this.metersService.findAll();
    return meters.map(this.toDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const meter = await this.metersService.findOne(Number(id));
    return this.toDto(meter);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateMeterDto: UpdateMeterDto) {
    const meter = await this.metersService.update(Number(id), updateMeterDto);
    return this.toDto(meter);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.metersService.remove(Number(id));
    return { success: true };
  }

  private toDto(meter: any) {
    return {
      id: meter.meterId ?? meter.id,
      meterNumber: meter.meterSerialNo ?? meter.meterNumber,
      status: meter.status,
      utilityTypeId: meter.utilityTypeId,
      utilityTypeName: meter.utilityType?.name ?? '',
      installationDate: meter.installationDate ? (typeof meter.installationDate === 'string' ? meter.installationDate : meter.installationDate.toISOString().slice(0, 10)) : '',
      isSmartMeter: meter.isSmartMeter,
    };
  }
}
