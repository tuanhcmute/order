import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateVoucherDto {
  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  code: string;

  @AutoMap()
  @ApiProperty()
  @IsOptional()
  description: string;
}

export class UpdateVoucherDto extends CreateVoucherDto {}
