import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(wishOwner: User, createWishDto: CreateWishDto): Promise<Wish> {
    const newWish = await this.wishRepository.save({
      ...createWishDto,
      owner: wishOwner,
    });
    return newWish;
  }

  async findLastWishes(): Promise<Wish[]> {
    const lastWishes = await this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
    });
    return lastWishes;
  }

  async findTopWishes(): Promise<Wish[]> {
    const topWishes = await this.wishRepository.find({
      order: { copied: 'DESC' },
      take: 20,
    });
    return topWishes;
  }

  async findMany(items: number[]): Promise<Wish[]> {
    const manyWishes = await this.wishRepository.findBy({ id: In(items) });
    return manyWishes;
  }

  async findOneWishById(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: { owner: true, offers: true },
    });
    if (!wish) {
      throw new NotFoundException('Такого желания нет');
    }
    return wish;
  }

  async updateWishById(
    id: number,
    userId: number,
    updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.findOneWishById(id);
    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Невозможно изменять чужие желания');
    }
    if (wish.offers.length > 0)
      throw new ForbiddenException(
        'Невозможно отредактировать желание, если кто-то уже решил скинуться',
      );
    this.wishRepository.update(id, updateWishDto);
  }

  async removeWishById(id: number) {
    // const wish = await this.findOneWishById(id);
    const removedWish = await this.wishRepository.delete(id);
    return removedWish;
  }

  async copyAnotherUserWish(id: number, user: User) {
    const desiredWish = await this.findOneWishById(id);
    const copiedWish = {
      ...desiredWish,
      owner: user.id,
      offers: [],
      copied: 0,
      raised: 0,
    };
    await this.create(user, copiedWish);
    this.wishRepository.update(id, { copied: ++desiredWish.copied });
  }
}
