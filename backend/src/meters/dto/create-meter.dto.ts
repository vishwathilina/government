import { IsString, IsOptional, IsDateString, IsBoolean, IsNumber } from 'class-validator';

export class CreateMeterDto {
  @IsString()
  meterNumber: string;

  @IsNumber()
  utilityTypeId: number;

  @IsDateString()
  installationDate: string;

  @IsBoolean()
  isSmartMeter: boolean;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  location?: string;
}
