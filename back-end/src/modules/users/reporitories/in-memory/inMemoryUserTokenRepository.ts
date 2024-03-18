import { IUserTokenRepository } from "../IUserTokenRepository";
import { UserToken } from '@prisma/client'
import { randomUUID } from 'crypto'

class InMemoryUserTokenRepository implements IUserTokenRepository {
  async findByToken(token: string): Promise<UserToken | null> {
    const userToken = this.userTokens.find(userToken => userToken.token === token)

    if (!userToken) {
      return null
    }

    return userToken
  }
  private userTokens: UserToken[] = []

  async generate(user_id: string): Promise<UserToken> {
    const userToken = {
      id: randomUUID(),
      token: randomUUID(),
      user_id,
      created_at: new Date(),
      updated_at: new Date()
    }

    this.userTokens.push(userToken)

    return userToken
  }
}
export { InMemoryUserTokenRepository }