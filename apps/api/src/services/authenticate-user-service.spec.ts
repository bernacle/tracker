import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthenticateService } from './authenticate-user-service';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { mockUsersRepository } from './mocks/repositories';

let sut: AuthenticateService;

describe('Authenticate Use Case', () => {
  const testUser = {
    id: 'user-1',
    email: 'johndoe@example.com',
    passwordHash: '',
  };

  beforeEach(async () => {
    testUser.passwordHash = await hash('123456', 6);
    mockUsersRepository.create = vi.fn().mockResolvedValue(testUser);
    mockUsersRepository.findByEmail = vi.fn().mockImplementation((email) => {
      if (email === testUser.email) return testUser;
      return null;
    });

    sut = new AuthenticateService(mockUsersRepository);
  });

  it('should be able to authenticate', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(user).toMatchObject({
      id: 'user-1',
      email: 'johndoe@example.com',
    });
  });

  it('should not be able to authenticate with wrong email', async () => {
    await expect(
      sut.execute({
        email: 'wrong@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await expect(
      sut.execute({
        email: 'johndoe@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
