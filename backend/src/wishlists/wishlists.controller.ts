import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from '../auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@Req() req, @Body() createWishlistDto: CreateWishlistDto) {
    const createdWishlist = this.wishlistsService.create(
      req.user,
      createWishlistDto,
    );
    return createdWishlist;
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.update(+id, req.user, updateWishlistDto);
  }

  @Delete(':id')
  removeOne(@Req() req, @Param('id') id: string) {
    return this.wishlistsService.removeOne(+id, req.user);
  }
}
