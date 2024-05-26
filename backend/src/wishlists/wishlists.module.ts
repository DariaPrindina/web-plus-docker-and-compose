import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { JwtModule } from '@nestjs/jwt';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { WishesModule } from '../wishes/wishes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist, Wish, User]),
    WishesModule,
    JwtModule,
  ],
  controllers: [WishlistsController],
  providers: [WishlistsService],
  exports: [WishlistsService],
})
export class WishlistsModule {}
