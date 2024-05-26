import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { HashService } from '../hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private hashService: HashService,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;
    const hashPassword = await this.hashService.createHash(password);
    const newUser = this.userRepository.create({
      ...rest,
      password: hashPassword,
    });
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    const allUsers = await this.userRepository.find();
    return allUsers;
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async findMyWishes(id: number) {
    const wishes = await this.wishRepository.find({
      where: { owner: { id } },
    });
    return wishes;
  }

  async findUserWishes(id: number) {
    const userWishes = await this.wishRepository.find({
      where: { owner: { id } },
      relations: ['owner'],
    });
    return userWishes;
  }

  async findOneUserByName(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });
    return user;
  }

  async findMany({ query }: FindUserDto): Promise<User[]> {
    const foundedUsers = this.userRepository.find({
      where: [{ username: query }, { email: query }],
    });
    return foundedUsers;
  }

  async updateOneById(id: number, updateUserDto: UpdateUserDto) {
    const { password, ...rest } = updateUserDto;
    if (password) {
      const hashPassword = await this.hashService.createHash(password);
      const updateUser = await this.userRepository.update(id, {
        ...rest,
        password: hashPassword,
      });
      return updateUser;
    } else {
      const updateUser = await this.userRepository.update(id, {
        ...rest,
      });
      return updateUser;
    }
  }

  async removeOneById(id: number) {
    await this.userRepository.delete(id);
  }
}
