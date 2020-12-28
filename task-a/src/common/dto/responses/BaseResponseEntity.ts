import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class BaseResponseEntity {
  @IsOptional()
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
  })
  @ApiProperty({
    description: 'entity Id',
  })
  public id: number;

  @ApiProperty({
    description: 'entity last update at',
  })
  @IsNotEmpty()
  @IsDateString()
  public udatedAt: string;

  @ApiProperty({
    description: 'entity created at',
  })
  @IsNotEmpty()
  @IsDateString()
  public createdAt: string;
}
