import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '@src/users/users.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.usersService.findOne(+userId);
      console.log(user);
      req.currentUser = user;
    }

    next();
  }
}
