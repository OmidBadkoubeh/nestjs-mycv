import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signUp request', () => {
    const data = { email: 'test@test.com', password: 'abcd1234' };

    return request(app.getHttpServer())
      .post('/auth/signUp')
      .send(data)
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(data.email);
      });
  });

  it('creates a new user then get the currently signedIn user', async () => {
    const email = 'test@test.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signUp')
      .send({ email, password: 'myPassword' })
      .expect(201);

    const cookies = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/user/@me')
      .set('Cookie', cookies)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
