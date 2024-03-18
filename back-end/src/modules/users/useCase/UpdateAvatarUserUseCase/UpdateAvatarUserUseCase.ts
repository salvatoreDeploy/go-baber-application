import "reflect-metadata";
import { IUserRepository } from "@modules/users/reporitories/IUserRepository";
import { IStorageProvaider } from "@providers/StorageProvaider/models/IStorageProvaider";
import { AppError } from "@shared/error/AppError";
import { inject, injectable } from "inversify";

interface IRequest {
  user_id: string;
  avatarFileName?: string;
}

@injectable()
class UpdateAvatarUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUserRepository,
    @inject("StorageProvaider")
    private storageProvaider: IStorageProvaider
  ) {}

  public async execute({ user_id, avatarFileName }: IRequest) {

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("Only authenticated users can change avatar", 401);
    }

    if (user.avatar) {
      await this.storageProvaider.delete(user.avatar);
    }

    if (avatarFileName) {
      user.avatar = avatarFileName;

      await this.storageProvaider.save(avatarFileName);

      await this.usersRepository.update({ user_id, avatar: avatarFileName });
    }

    return user;
  }
}

export { UpdateAvatarUserUseCase };
