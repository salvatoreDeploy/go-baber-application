import "reflect-metadata";
import { IUserRepository } from "@modules/users/reporitories/IUserRepository";
import { inject, injectable } from "inversify";
import { AppError } from "@shared/error/AppError";
import { IUserTokenRepository } from "@modules/users/reporitories/IUserTokenRepository";
import { IResetPasswordDTO } from "@modules/users/reporitories/dtos/IResetPasswordDTO";
import IHashProvider from "@modules/users/providers/HashProvider/models/IHashProvider";
import { isAfter, addHours } from "date-fns";

@injectable()
class ResetPasswordEmailUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUserRepository,
    @inject("UserTokenRepository")
    private userTokenRepository: IUserTokenRepository,
    @inject("HashProvider")
    private hashedProvider: IHashProvider
  ) { }

  public async execute({ token, password, old_password }: IResetPasswordDTO): Promise<void> {

    const userToken = await this.userTokenRepository.findByToken(token)

    if (!userToken) {
      throw new AppError('User token does not exists')
    }

    const user = await this.usersRepository.findById(userToken?.user_id)

    if (!user) {
      throw new AppError('User does not exists')
    }

    const passwordMatched = await this.hashedProvider.compareHash(
      old_password,
      user.password
    );

    if (!passwordMatched) {
      throw new AppError("Old Password incorrect!", 401);
    }

    const tokenCreatedAt = userToken.created_at
    const compareDate = addHours(tokenCreatedAt, 2)

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token Expired')
    }

    user.password = await this.hashedProvider.generateHash(password)

    await this.usersRepository.save(user)
  }
}

export { ResetPasswordEmailUseCase };
