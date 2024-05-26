import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async createHash(password: string): Promise<string> {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    const isCompare = await bcrypt.compare(password, hash);
    return isCompare;
  }
}
