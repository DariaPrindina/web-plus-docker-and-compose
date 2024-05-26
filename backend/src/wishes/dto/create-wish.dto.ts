import { IsNumber, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishDto {
  @Length(1, 250)
  @IsString()
  name: string;

  @IsUrl()
  @IsString()
  link: string;

  @IsUrl()
  @IsString()
  image: string;

  @IsNumber()
  price: number;

  @Length(1, 1024)
  @IsString()
  description: string;
}
