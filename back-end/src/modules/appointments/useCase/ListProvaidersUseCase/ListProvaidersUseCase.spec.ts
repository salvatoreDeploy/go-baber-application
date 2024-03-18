import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from '@modules/users/reporitories/in-memory/inMemoryUsersRepository';
import { AppError } from "@shared/error/AppError";
import { ListProvaidersUseCase } from "./ListProvaidersUseCase";
import FakeCacheProvider from "@providers/CacheProvaider/fakes/fakeCacheProvider";

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeCacheProvider: FakeCacheProvider
let sut: ListProvaidersUseCase;


describe('List Provaiders', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeCacheProvider = new FakeCacheProvider()
    sut = new ListProvaidersUseCase(
      inMemoryUsersRepository,
      fakeCacheProvider
    );
  });

  it('should be able to list providers', async () => {
    const user_one = await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
    });

    const user_two = await inMemoryUsersRepository.create({
      name: 'John Trê',
      email: 'johntre@example.com',
      password: '123123',
    });

    const loggedUser = await inMemoryUsersRepository.create({
      name: 'John Logado',
      email: 'johnlogged@example.com',
      password: '123123',
    });

    const providers = await sut.execute({
      user_id: loggedUser.id
    });

    expect(providers).toEqual([user_one, user_two])
  });
});