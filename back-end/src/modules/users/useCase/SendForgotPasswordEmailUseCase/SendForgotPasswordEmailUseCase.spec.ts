import { beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryUsersRepository } from "@modules/users/reporitories/in-memory/inMemoryUsersRepository";
import { InMemoryUserTokenRepository } from "@modules/users/reporitories/in-memory/inMemoryUserTokenRepository";
import { FakeMailProvider } from "@providers/EmailProvider/fakes/fakeMailProvider";
import { SendForgotPasswordEmailUseCase } from "./SendForgotPasswordEmailUseCase";
import { AppError } from "@shared/error/AppError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryUserTokenRepository: InMemoryUserTokenRepository
let sut: SendForgotPasswordEmailUseCase;
let fakeMailProvider: FakeMailProvider;

describe("Create Appointments Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryUserTokenRepository = new InMemoryUserTokenRepository();
    fakeMailProvider = new FakeMailProvider()
    sut = new SendForgotPasswordEmailUseCase(inMemoryUsersRepository, fakeMailProvider, inMemoryUserTokenRepository);

  });

  it("Should be able to recover the password using the email", async () => {

    const sendMail = vi.spyOn(fakeMailProvider, 'sendMail')

    await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    await sut.execute({ email: 'johndoe@example.com' })

    expect(sendMail).toBeCalled()
  });

  it("Should not be able to recover a non-existing user password", async () => {
    await expect(sut.execute({ email: 'johndoe@example.com' })).rejects.toBeInstanceOf(AppError)
  });

  it("Should generate a forgot password token", async () => {
    const sendMail = vi.spyOn(fakeMailProvider, 'sendMail')
    const generateToken = vi.spyOn(inMemoryUserTokenRepository, 'generate')

    const user = await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    await sut.execute({ email: 'johndoe@example.com' })

    expect(sendMail).toBeCalled()
    expect(generateToken).toHaveBeenCalledWith(user.id)
  })
});