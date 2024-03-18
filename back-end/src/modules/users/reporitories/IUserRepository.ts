import { Users } from "@prisma/client";
import { ICreateUsersDTO } from "./dtos/ICreateUsersDTO";

export interface IUserRepository {
  findByEmail(email: string): Promise<Users | null>
  findById(id: string): Promise<Users | null>
  create(data: ICreateUsersDTO): Promise<Users>
  update(data: IUpdateAvatarDTO): Promise<void>
  list(): Promise<Users[]>
  save(user: Users): Promise<Users>
  findAllProvaiders(data: IFindAllProvaiderDTO): Promise<Users[]>
}