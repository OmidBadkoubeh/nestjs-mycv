import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(email: string, password: string): Promise<User> {
    const user = this.userRepo.create({ email, password });

    return this.userRepo.save(user);
  }

  async findOne(id: string): Promise<User> {
    return this.userRepo.findOne(id);
  }

  async find(email: string): Promise<User[]> {
    return this.userRepo.find({ email });
  }

  async update(id: string, attrs: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, attrs);
    return this.userRepo.save(user);
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    return this.userRepo.remove(user);
  }
}
