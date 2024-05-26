import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { WishesModule } from './wishes/wishes.module';
import { User } from './users/entities/user.entity';
import { Wish } from './wishes/entities/wish.entity';
import { Wishlist } from './wishlists/entities/wishlist.entity';
import { Offer } from './offers/entities/offer.entity';
import { HashModule } from './hash/hash.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import dotenv = require('dotenv');

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DBNAME,
      entities: [User, Wish, Wishlist, Offer],
      synchronize: true,
    }),
    UsersModule,
    WishlistsModule,
    OffersModule,
    WishesModule,
    HashModule,
    AuthModule,
  ],
})
export class AppModule {}
