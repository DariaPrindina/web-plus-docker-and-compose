import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishesService } from '../wishes/wishes.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(
    user: User,
    createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const wishes = await this.wishesService.findMany(createWishlistDto.itemsId);
    const wishlist = this.wishlistsRepository.create({
      ...createWishlistDto,
      owner: user,
      items: wishes,
    });
    const savedWishlist = await this.wishlistsRepository.save(wishlist);
    return savedWishlist;
  }

  async findAll(): Promise<Wishlist[]> {
    const findedWishlists = await this.wishlistsRepository.find({
      relations: ['owner', 'items'],
    });
    return findedWishlists;
  }

  async findOne(id: number) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
    return wishlist;
  }

  async update(
    id: number,
    user: User,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    const wishlistForUpdate = await this.findOne(id);
    if (user.id !== wishlistForUpdate.owner.id) {
      throw new ForbiddenException('Невозможно изменить чужой список желаний');
    }
    const wishesInNewWishlist = await this.wishesService.findMany(
      updateWishlistDto.itemsId,
    );
    const updatedWishlist = await this.wishlistsRepository.save({
      ...wishlistForUpdate,
      name: updateWishlistDto.name,
      image: updateWishlistDto.image,
      items: wishesInNewWishlist,
    });
    return updatedWishlist;
  }

  async removeOne(id: number, user: User) {
    const wishlistForDelete = await this.findOne(id);
    if (user.id !== wishlistForDelete.owner.id) {
      throw new ForbiddenException('Невозможно удалить чужой список желаний');
    }
    const deletedWishlist = await this.wishlistsRepository.delete(id);
    return deletedWishlist;
  }
}
