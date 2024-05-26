import { IsString, Length } from 'class-validator';

export class FindUserDto {
  @Length(2, 30)
  @IsString()
  query: string;
}
