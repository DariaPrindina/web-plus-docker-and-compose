import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Req,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { JwtGuard } from '../auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(createUserDto);
    return newUser;
  }

  @Get()
  async findAll() {
    const allUsers = await this.usersService.findAll();
    return allUsers;
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    const user = await this.usersService.findOneUserByName(username);
    return user;
  }

  @Get('me')
  async findOwn(@Req() req) {
    const user = await this.usersService.findOneById(req.user.id);
    return user;
  }

  @Get('me/wishes')
  async getOwnWishes(@Req() req) {
    const myWishes = await this.usersService.findUserWishes(req.user.id);
    return myWishes;
  }

  @Get(':username/wishes')
  async getWishes(@Param('username') username: string) {
    const user = await this.findOne(username);
    const userWishes = await this.usersService.findUserWishes(user.id);
    return userWishes;
  }

  @Patch('me')
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.updateOneById(
      req.user.id,
      updateUserDto,
    );
    return updatedUser;
  }

  @Post('find')
  async findMany(@Body() findUserDto: FindUserDto) {
    const foundUser = this.usersService.findMany(findUserDto);
    return foundUser;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.removeOneById(+id);
  }
}
