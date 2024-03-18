import { beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryUsersRepository } from "@modules/users/reporitories/in-memory/inMemoryUsersRepository";
import { InMemoryUserTokenRepository } from "@modules/users/reporitories/in-memory/inMemoryUserTokenRepository";
import { ResetPasswordEmailUseCase } from "./ResetPasswordUseCase";
import FakeHashProvider from "@modules/users/providers/HashProvider/fakes/fakeHashProvider";
import { AppError } from "@shared/error/AppError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryUserTokenRepository: InMemoryUserTokenRepository
let fakeHashProvider: FakeHashProvider;
let sut: ResetPasswordEmailUseCase;


describe("Create Appointments Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryUserTokenRepository = new InMemoryUserTokenRepository();
    fakeHashProvider = new FakeHashProvider();
    sut = new ResetPasswordEmailUseCase(inMemoryUsersRepository, inMemoryUserTokenRepository, fakeHashProvider);
  });

  it('Should be able to reset the password', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    const { token } = await inMemoryUserTokenRepository.generate(user.id)

    const generateHash = vi.spyOn(fakeHashProvider, 'generateHash')
    const compareHash = vi.spyOn(fakeHashProvider, 'compareHash')

    await sut.execute({ token, old_password: '123456', password: 'newPassword' })

    const updatedPassword = await inMemoryUsersRepository.findById(user.id)

    expect(generateHash).toHaveBeenCalledWith('newPassword')
    expect(updatedPassword?.password).toBe('newPassword')
  })

  it('Should not be able to reset password whith non-existing token', async () => {
    await expect(sut.execute({
      token: 'non-existing-token',
      old_password: '123456',
      password: 'password'
    })).rejects.toBeInstanceOf(AppError)
  })
  it('Should not be able to reset password whith non-existing user', async () => {

    const { token } = await inMemoryUserTokenRepository.generate('non-exists-user')

    await expect(sut.execute({
      token,
      old_password: '123456',
      password: 'password'
    })).rejects.toBeInstanceOf(AppError)
  })
  it('Should not be able to reset password if passed more then 2 hours', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    const { token } = await inMemoryUserTokenRepository.generate('non-exists-user')

    vi.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customdate = new Date();
      return customdate.setHours(customdate.getHours() + 3);
    })

    await expect(sut.execute({
      token,
      old_password: '123456',
      password: '123456'
    })).rejects.toBeInstanceOf(AppError)
  });
})