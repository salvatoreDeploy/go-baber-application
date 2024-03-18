import { IUserRepository } from "@modules/users/reporitories/IUserRepository";
import { Users } from "@prisma/client";
import { inject, injectable } from "inversify";

@injectable()
class ListUsersUseCase {

  constructor(
    @inject("UsersRepository")
    private usersRepository: IUserRepository) { }

  async execute(): Promise<Users[]> {

    const users = await this.usersRepository.list();

    return users;
  }
}

export { ListUsersUseCase };
