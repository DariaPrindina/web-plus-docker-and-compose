import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { HashService } from '../hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private hashService: HashService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findOneUserByName(username);

    if (!user) throw new NotFoundException('Такого пользователя не существует');

    const comparedHashedPassword = this.hashService.compareHash(
      password,
      user.password,
    );

    if (!comparedHashedPassword) {
      throw new UnauthorizedException('Неверное имя или пароль');
    }

    if (user && comparedHashedPassword) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
}
