import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@shared/error/AppError";
import { InMemoryUsersRepository } from "@modules/users/reporitories/in-memory/inMemoryUsersRepository";
import { AuthenticatesessionsUseCase } from "./AuthenticateSessionsUseCase";
import { CreateUsersUseCase } from "../CreateUsersUseCase/CreateUsersUseCase";
import FakeHashProvider from "@modules/users/providers/HashProvider/fakes/fakeHashProvider";
import FakeCacheProvider from "@providers/CacheProvaider/fakes/fakeCacheProvider";

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvaider: FakeCacheProvider
let sut: AuthenticatesessionsUseCase;

describe("Autheticate User Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvaider = new FakeCacheProvider()
    sut = new AuthenticatesessionsUseCase(
      inMemoryUsersRepository,
      fakeHashProvider,
    );
  });

  it("Should be able to authenticate", async () => {
    const createUserUseCase = new CreateUsersUseCase(
      inMemoryUsersRepository,
      fakeHashProvider,
      fakeCacheProvaider
    );

    const user = await createUserUseCase.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const response = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(response).toHaveProperty("token");
    expect(response).toHaveProperty("user");
    expect(response.user).toEqual(user);
  });

  it("Should not be possible to authenticate with non-existent credentials", async () => {
    expect(() =>
      sut.execute({ email: "johndoeteste@example.com", password: "teste" })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to authenticate with wrong password", async () => {
    const createUserUseCase = new CreateUsersUseCase(
      inMemoryUsersRepository,
      fakeHashProvider,
      fakeCacheProvaider
    );

    await createUserUseCase.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "wrong-password",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
