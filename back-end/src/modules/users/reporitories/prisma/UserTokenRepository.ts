import { PrismaClient, UserToken, Users } from "@prisma/client";
import { ICreateUsersDTO } from "../dtos/ICreateUsersDTO";
import prismaClient from "@shared/infra/prisma";
import { IUserRepository } from "../IUserRepository";
import { injectable } from "inversify";
import { IUserTokenRepository } from "../IUserTokenRepository";

@injectable()
class UserTokenRepository implements IUserTokenRepository {

  private ormPrisma: PrismaClient

  constructor() {
    this.ormPrisma = prismaClient
  }

  generate(user_id: string): Promise<UserToken> {
    const userToken = this.ormPrisma.userToken.create({
      data: {
        user_id
      }
    })

    return userToken
  }

  public async findByToken(token: string): Promise<UserToken | null> {
    const userToken = await this.ormPrisma.userToken.findFirst({
      where: {
        token
      }
    })

    return userToken
  }


}

export { UserTokenRepository };