import "reflect-metadata";
import { sign } from "jsonwebtoken";
import { Users } from "@prisma/client";
import { AppError } from "@shared/error/AppError";
import { authConfig } from "@config/Auth";
import { IUserRepository } from "@modules/users/reporitories/IUserRepository";
import { inject, injectable } from "inversify";
import IHashProvider from "@modules/users/providers/HashProvider/models/IHashProvider";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: Users;
  token: string;
}

@injectable()
class AuthenticatesessionsUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUserRepository,
    @inject("HashProvider")
    private hashedProvider: IHashProvider
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Email or Password incorrect!", 401);
    }

    const passwordMatched = await this.hashedProvider.compareHash(
      password,
      user.password
    );

    if (!passwordMatched) {
      throw new AppError("Email or Password incorrect!", 401);
    }

    const { expiresIn, secret } = authConfig.jwt;

    
    if (!secret) {
      throw new Error('Invalid enviroment')
    }

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }
}

export { AuthenticatesessionsUseCase };
