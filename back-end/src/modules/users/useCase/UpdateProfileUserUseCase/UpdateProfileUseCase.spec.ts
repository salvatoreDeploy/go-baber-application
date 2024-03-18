import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from '@modules/users/reporitories/in-memory/inMemoryUsersRepository';
import { UpdateProfileUseCase } from './UpdateProfileUseCase';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/fakeHashProvider';
import { AppError } from "@shared/error/AppError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHashProvider: FakeHashProvider
let sut: UpdateProfileUseCase;


describe('UpdateProfile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    sut = new UpdateProfileUseCase(
      inMemoryUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'john Doe',
      email: 'johndoe@example.com',
      password: '123123',
    });

    const updatedUser = await sut.execute({
      user_id: user.id,
      name: 'John quad',
      email: 'johnquad@example.com',
    });

    expect(updatedUser.name).toBe('John quad');
    expect(updatedUser.email).toBe('johnquad@example.com');
  });

  it('should not be able update the profile from non-existing user', async () => {
    await expect(
      sut.execute({
        user_id: 'non-existing-user-id',
        name: 'John Duo',
        email: 'john@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change to another user email', async () => {
    await inMemoryUsersRepository.create({
      name: 'john Doe',
      email: 'johndoe@example.com',
      password: '123123',
    });

    const user = await inMemoryUsersRepository.create({
      name: 'john Quad',
      email: 'teste@example.com',
      password: '123123',
    });

    await expect(
      sut.execute({
        user_id: user.id,
        name: 'John quad',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'john Doe',
      email: 'johndoe@example.com',
      password: '123123',
    });

    const updatedUser = await sut.execute({
      user_id: user.id,
      name: 'John quad',
      email: 'johnquad@example.com',
      oldPassword: '123123',
      password: '123456',
    });

    expect(updatedUser.password).toBe('123456');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'john Doe',
      email: 'johndoe@example.com',
      password: '123123',
    });

    await expect(
      sut.execute({
        user_id: user.id,
        name: 'John quad',
        email: 'johnquad@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'john Doe',
      email: 'johndoe@example.com',
      password: '123123',
    });

    await expect(
      sut.execute({
        user_id: user.id,
        name: 'John quad',
        email: 'johnquad@example.com',
        oldPassword: 'wrong-old-password',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});