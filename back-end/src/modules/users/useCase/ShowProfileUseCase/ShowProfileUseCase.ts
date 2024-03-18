import "reflect-metadata";
import { IUserRepository } from "@modules/users/reporitories/IUserRepository";
import { Users } from "@prisma/client";
import { AppError } from "@shared/error/AppError";
import { inject, injectable } from "inversify";

interface IRequest {
  user_id: string;
}

@injectable()
class ShowProfileUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,
  ) { }

  public async execute({
    user_id
  }: IRequest): Promise<Users> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    return user;
  }
}

export { ShowProfileUseCase }