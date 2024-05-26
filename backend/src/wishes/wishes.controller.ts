import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post('')
  async create(@Req() req, @Body() createWishDto: CreateWishDto) {
    const createdWish = await this.wishesService.create(
      req.user,
      createWishDto,
    );
    return createdWish;
  }

  @Get('last')
  findLast() {
    const lastWishes = this.wishesService.findLastWishes();
    return lastWishes;
  }

  @Get('top')
  findTop() {
    const topWishes = this.wishesService.findTopWishes();
    return topWishes;
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') wishId: string) {
    const wish = this.wishesService.findOneWishById(+wishId);
    return wish;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') wishId: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const updateWish = await this.wishesService.updateWishById(
      +wishId,
      req.user.id,
      updateWishDto,
    );
    return updateWish;
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  removeOne(@Param('id') wishId: string) {
    const deletedWish = this.wishesService.removeWishById(+wishId);
    return deletedWish;
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(@Req() req, @Param('id') id: number) {
    const copiedWish = await this.wishesService.copyAnotherUserWish(
      id,
      req.user,
    );
    return copiedWish;
  }
}
