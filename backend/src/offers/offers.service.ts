import { ForbiddenException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { User } from '../users/entities/user.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto): Promise<Offer> {
    const wish = await this.wishesService.findOneWishById(
      createOfferDto.itemId,
    );
    const { amount } = createOfferDto;
    const remainingAmount = wish.price - wish.raised;
    if (remainingAmount < amount) {
      throw new ForbiddenException(
        'Сумма собранных средств не может превышать стоимость подарка',
      );
    }
    if (wish.owner.id === user.id) {
      throw new ForbiddenException('Невозможно скинуться на свое желание');
    }
    const createdOffer = {
      ...createOfferDto,
      item: wish,
      user,
    };
    const savedOffer = await this.offersRepository.save(createdOffer);
    return savedOffer;
  }

  async findAll() {
    const allOffers = await this.offersRepository.find({
      relations: ['user', 'item'],
    });
    return allOffers;
  }

  async findOne(id: number) {
    const oneOffer = await this.offersRepository.find({
      where: { id },
      relations: ['user', 'item'],
    });
    return oneOffer;
  }
}
