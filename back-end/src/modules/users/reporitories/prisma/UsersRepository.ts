import { PrismaClient, Users } from "@prisma/client";
import { ICreateUsersDTO } from "../dtos/ICreateUsersDTO";
import prismaClient from "@shared/infra/prisma";
import { IUserRepository } from "../IUserRepository";
import { injectable } from "inversify";

@injectable()
class UsersRepository implements IUserRepository {

  private ormPrisma: PrismaClient

  constructor() {
    this.ormPrisma = prismaClient
  }

  public async save(user: Users): Promise<Users> {
    const users = await this.ormPrisma.users.update({
      where: {
        id: user.id
      },
      data: {
        ...user
      }
    })

    return users
  }

  public async findByEmail(email: string) {
    const findEmailExists = await this.ormPrisma.users.findFirst({
      where: {
        email,
      },
    })

    return findEmailExists || null;
  }

  public async findById(id: string): Promise<Users | null> {
    const findIdExists = await this.ormPrisma.users.findFirst({
      where: {
        id,
      },
    });

    return findIdExists;
  }

  public async create({ name, email, password }: ICreateUsersDTO) {
    const user = await this.ormPrisma.users.create({
      data: {
        name,
        email,
        password,
      },
    });

    return user;
  }

  public async update({ user_id, avatar }: IUpdateAvatarDTO) {
    const user = await this.ormPrisma.users.update({
      where: {
        id: user_id,
      },
      data: {
        avatar,
      },
    });
  }

  public async list(): Promise<Users[]> {
    const users = await prismaClient.users.findMany();

    return users;
  }

  public async findAllProvaiders({ execept_user_id }: IFindAllProvaiderDTO): Promise<Users[]> {
    let users: Users[]

    if (execept_user_id) {
      users = await this.ormPrisma.users.findMany({
        where: {
          id: {
            not: execept_user_id
          }
        }
      })
    } else {
      users = await this.ormPrisma.users.findMany()
    }

    return users
  }
}

export { UsersRepository };
