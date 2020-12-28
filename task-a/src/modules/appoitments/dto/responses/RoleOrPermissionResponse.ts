import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

import { BaseResponseEntity } from '../../../../common/dto/responses/BaseResponseEntity';

export class RoleOrPermissionResponse extends BaseResponseEntity {
  @ApiProperty({
    description: 'entity name',
  })
  @IsNotEmpty()
  @MinLength(6, {
    message: 'first name is too short',
  })
  @MaxLength(100, {
    message: 'last name is too long',
  })
  public name: string;
  @ApiProperty({
    description: 'entity slug name',
  })
  @MinLength(10, {
    message: 'first name is too short',
  })
  @MaxLength(50, {
    message: 'last name is too long',
  })
  @IsNotEmpty()
  public slug: string;
  @ApiProperty({
    description: 'entity description',
  })
  @IsOptional()
  @IsAlphanumeric()
  public description: string;
}
