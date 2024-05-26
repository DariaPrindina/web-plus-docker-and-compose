import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { HashService } from '../hash/hash.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish]), JwtModule],
  controllers: [UsersController],
  providers: [UsersService, HashService],
  exports: [UsersService],
})
export class UsersModule {}
