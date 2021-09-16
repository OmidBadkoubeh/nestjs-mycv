import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signUp(email: string, password: string) {
    const users = await this.usersService.find(email);

    // if user with given email already exists
    if (users.length > 0) {
      throw new ConflictException('User with this email already exists!');
    }

    // hash user password
    const hashedPassword = await this.hashWithSalt(password);

    // create new user
    const user = await this.usersService.create(email, hashedPassword);

    return user;
  }

  private async hashWithSalt(password: string) {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    return salt + '.' + hash.toString('hex');
  }

  private getSalt(hashedPassword: string) {
    try {
      return hashedPassword.split('.')[0];
    } catch (error) {
      throw new InternalServerErrorException(error, 'Something went wrong!');
    }
  }

  async signIn() {
    // signIn
  }
}
