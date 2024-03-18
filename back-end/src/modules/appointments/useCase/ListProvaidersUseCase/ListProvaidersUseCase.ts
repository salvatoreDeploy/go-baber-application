import "reflect-metadata";
import { IUserRepository } from "@modules/users/reporitories/IUserRepository";
import { Users } from "@prisma/client";
import { AppError } from "@shared/error/AppError";
import { inject, injectable } from "inversify";
import ICacheProvider from "@providers/CacheProvaider/models/ICacheProvider";

interface IRequest {
  user_id: string;
}

@injectable()
class ListProvaidersUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject("CacheProvaider")
    private cacheProvaider: ICacheProvider
  ) { }

  public async execute({
    user_id
  }: IRequest): Promise<Users[]> {
    let users = await this.cacheProvaider.recover<Users[]>(`providers-list:${user_id}`)

    if (!users) {

      users = await this.usersRepository.findAllProvaiders({ execept_user_id: user_id })

      await this.cacheProvaider.save({key: `providers-list:${user_id}`, value: users})
    }

    return users;
  }
}

export { ListProvaidersUseCase }