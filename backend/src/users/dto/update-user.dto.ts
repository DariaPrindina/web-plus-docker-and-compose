import { PartialType } from '@nestjs/swagger';
import { IsEmail, IsString, IsUrl, Length } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Length(2, 30)
  @IsString()
  username?: string;

  @Length(2, 200)
  @IsString()
  about?: string;

  @IsUrl()
  @IsString()
  avatar?: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  password?: string;
}
