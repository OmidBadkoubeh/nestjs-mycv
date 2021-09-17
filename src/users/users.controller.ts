import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser, Serialize } from 'src/decorators';
import { AuthGuard } from 'src/guards';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Get(':id')
  findUser(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(+id, body);
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('signUp')
  async createUser(@Session() session: any, @Body() body: CreateUserDto) {
    const user = await this.authService.signUp(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signIn')
  async signIn(@Session() session: any, @Body() body: CreateUserDto) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signOut')
  async signOut(@Session() session: any) {
    session.userId = null;
  }

  @Post('whoAmI')
  async whoAmI(@Session() session: any) {
    const userId = session.userId;
    return this.usersService.findOne(+userId);
  }

  @UseGuards(AuthGuard)
  @Get('/user/@me')
  async currentUser(@CurrentUser() user: User) {
    return user;
  }
}
