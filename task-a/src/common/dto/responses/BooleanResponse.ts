import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class BooleanResponse {
  @ApiProperty({
    description: 'Operation status',
  })
  @IsBoolean()
  public result: boolean;
}
