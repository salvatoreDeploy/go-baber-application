import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from '@modules/users/reporitories/in-memory/inMemoryUsersRepository';
import { AppError } from "@shared/error/AppError";
import { ShowProfileUseCase } from "./ShowProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: ShowProfileUseCase;


describe('Show Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new ShowProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it('should be able to show the profile', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
    });

    const profile = await sut.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('johndoe@example.com');
  });

  it('should not be able to show the profile from non-existing user', async () => {

    expect(sut.execute({
      user_id: 'non-existing',
    })).rejects.toBeInstanceOf(AppError)
  });

});