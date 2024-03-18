import { InMemoryUsersRepository } from "@modules/users/reporitories/in-memory/inMemoryUsersRepository";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UpdateAvatarUserUseCase } from "./UpdateAvatarUserUseCase";
import { FakeStorageProvider } from "@providers/StorageProvaider/fakes/fakeStorageProvider";
import { AppError } from "@shared/error/AppError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let sut: UpdateAvatarUserUseCase;

describe("Update Avatar Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    sut = new UpdateAvatarUserUseCase(
      inMemoryUsersRepository,
      fakeStorageProvider
    );
  });

  it("Should be able to update avatar", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    await sut.execute({
      user_id: user.id,
      avatarFileName: "avatar.jpg",
    });

    expect(user.avatar).toBe("avatar.jpg");
  });

  it("Should be able to update avatar from non existing user", async () => {
    expect(() =>
      sut.execute({
        user_id: "non-existing-user",
        avatarFileName: "avatar.jpg",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Should delete old avatar when updating new one", async () => {
    const deleteFunction = vi.spyOn(fakeStorageProvider, "delete");

    const user = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    await sut.execute({
      user_id: user.id,
      avatarFileName: "avatar.jpg",
    });

    await sut.execute({
      user_id: user.id,
      avatarFileName: "avatar2.jpg",
    });
    expect(deleteFunction).toHaveBeenLastCalledWith("avatar.jpg");
    expect(user.avatar).toBe("avatar2.jpg");
  });
});
