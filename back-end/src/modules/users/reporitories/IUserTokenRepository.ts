import { UserToken } from '@prisma/client'

export interface IUserTokenRepository {
  generate(user_id: string): Promise<UserToken>
  findByToken(token: string): Promise<UserToken | null>
}