import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

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
    const hashedPassword = await this.hashPassword(password);

    // create new user
    const user = await this.usersService.create(email, hashedPassword);

    return user;
  }

  async signIn(email: string, password: string): Promise<User> {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('User with given email not found!');
    }

    const salt = this.getSalt(user.password);
    const hashedPassword = this.getHashedPassword(user.password);

    const hash = await this.hash(password, salt);
    const hashPassword = hash.toString('hex');

    if (hashPassword !== hashedPassword) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return user;
  }

  private async hash(password: string, salt: string): Promise<Buffer> {
    return (await scrypt(password, salt, 32)) as Buffer;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(8).toString('hex');
    const hash = await this.hash(password, salt);
    return salt + '.' + hash.toString('hex');
  }

  private getSalt(hashedPassword: string): string {
    try {
      return hashedPassword.split('.')[0];
    } catch (error) {
      throw new InternalServerErrorException(error, 'Something went wrong!');
    }
  }

  private getHashedPassword(hashedPassword: string): string {
    try {
      return hashedPassword.split('.')[1];
    } catch (error) {
      throw new InternalServerErrorException(error, 'Something went wrong!');
    }
  }
}
