import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user: User = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        };
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted & hashed password', async () => {
    const user = await service.signUp('test@test.com', 'p@sSw0rD');
    expect(user.password).not.toEqual('p@sSw0rD');

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws error when try to signUp with an existing email', async () => {
    await service.signUp('a@a.com', 'password123');

    service.signUp('a@a.com', 'password123').catch((e) => {
      expect(e.status).toEqual(409);
      expect(e.message).toContain('email already exist');
    });
  });

  it('throws error when try to signIn with non existing email', () => {
    service.signIn('a@a.com', 'password123').catch((e) => {
      expect(e.status).toEqual(404);
      expect(e.message).toContain('not found');
    });
  });

  it('throws error if invalid password is provided', async () => {
    await service.signUp('ex@mp.le', 'myPassword');

    service.signIn('ex@mp.le', 'wrongPassword').catch((e) => {
      expect(e).toBeDefined();
      expect(e.status).toEqual(401);
      expect(e.message).toMatch(/invalid credentials/i);
    });
  });

  it('returns a user if correct password provided', async () => {
    await service.signUp('ex@mp.le', 'myPassword');

    const user = await service.signIn('ex@mp.le', 'myPassword');
    expect(user).toBeDefined();
  });
});
