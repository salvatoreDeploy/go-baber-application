import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@shared/error/AppError";
import { InMemoryUsersRepository } from "@modules/users/reporitories/in-memory/inMemoryUsersRepository";
import { CreateUsersUseCase } from "./CreateUsersUseCase";
import FakeHashProvider from "@modules/users/providers/HashProvider/fakes/fakeHashProvider";
import FakeCacheProvider from "@providers/CacheProvaider/fakes/fakeCacheProvider";

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider
let sut: CreateUsersUseCase;

describe("Create Appointments Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new  FakeCacheProvider()
    sut = new CreateUsersUseCase(inMemoryUsersRepository, fakeHashProvider, fakeCacheProvider);
  });

  it("Should be able to create new User", async () => {
    const user = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user).toHaveProperty("id");
  });

  it("should not be able to register with same email twice", async () => {
    const user = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await fakeHashProvider.compareHash(
      "123456",
      user.password
    );

    // console.log(isPasswordCorrectlyHashed);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("Should be able to create new user with same email from another", async () => {
    const email = "johndoe@example.com";

    await sut.execute({
      name: "John Doe",
      email,
      password: "123456",
    });

    expect(() =>
      sut.execute({
        name: "John Doe",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
