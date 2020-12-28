import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

import { AbstractDto } from '../../../../common/dto/AbstractDto';
import { GenderEnum } from '../../../../common/utils/enums';
import { User } from '../../entities/Users.entity';

export class UserResponse extends AbstractDto {

  constructor(user: User) {
    super(user);
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.phone = user.phone;
    this.username = user.username;
  }
  @ApiProperty({
    description: 'user first name',
  })
  @IsNotEmpty()
  @MinLength(2, {
    message: 'first name is too short',
  })
  @MaxLength(50, {
    message: 'last name is too long',
  })
  public firstName: string;

  @ApiProperty({
    description: 'user last name',
  })
  @IsNotEmpty()
  @MinLength(2, {
    message: 'last name is too short',
  })
  @MaxLength(50, {
    message: 'last name is too long',
  })
  public lastName: string;

  @IsEmail()
  @ApiProperty({
    description: 'user email',
  })
  @IsNotEmpty()
  public email: string;

  @ApiProperty({
    description: 'username',
  })
  @IsNotEmpty()
  @MinLength(7, {
    message: 'username is too short',
  })
  @MaxLength(15, {
    message: 'username is too long',
  })
  public username: string;
  @ApiProperty({
    description: 'user gender',
  })
  @IsEnum(['male', 'female'])
  public gender: GenderEnum;
  @ApiProperty({
    description: 'user phone',
  })
  @IsNotEmpty()
  @MinLength(7, {
    message: 'phone is too short',
  })
  @MaxLength(15, {
    message: 'phone is too long',
  })
  public phone?: string;
}
