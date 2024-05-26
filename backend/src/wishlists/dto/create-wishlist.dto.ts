import { IsString, IsUrl, Length, IsArray } from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  @IsString()
  name: string;

  @IsUrl()
  @IsString()
  image: string;

  @IsArray()
  @IsString()
  itemsId: number[];
}
