import { compare, hash } from 'bcryptjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { mockUsersRepository } from './mocks/repositories';
import { RegisterService } from './register-user-service';

let sut: RegisterService;

describe('Register Use Case', () => {
  const testUser = {
    id: 'user-1',
    name: 'John Doe',
    email: 'johndoe@example.com',
    passwordHash: '',
  };

  beforeEach(async () => {
    testUser.passwordHash = await hash('123456', 6);

    mockUsersRepository.create = vi.fn().mockResolvedValue(testUser);
    mockUsersRepository.findByEmail = vi.fn().mockResolvedValue(null);

    sut = new RegisterService(mockUsersRepository);
  });

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const isPasswordCorrectlyHashed = await compare('123456', user.passwordHash);
    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with the same email twice', async () => {
    mockUsersRepository.findByEmail = vi.fn().mockResolvedValue(testUser);

    await expect(
      sut.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it('should be able to register a new user successfully', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(user).toMatchObject({
      id: 'user-1',
      name: 'John Doe',
      email: 'johndoe@example.com',
    });
  });
});
