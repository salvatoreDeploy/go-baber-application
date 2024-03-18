import 'dotenv/config'
import { Users } from "@prisma/client";
import Upload from '@config/Upload';
import { getUrlImage } from 'utils/getUrl';


export class HttpUserPresenter {
  static async toHttp(user: Users ) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      avatar_url: await this.formatUrl(user, user.avatar),
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  static async toHttpArray(users: Users[]): Promise<any[]> {
    const httpUsers: any[] = [];
    for (const user of users) {
      const httpUser = await this.toHttp(user);
      httpUsers.push(httpUser);
    }
    return httpUsers;
  }

  private static async formatUrl(
    user: Users,
    url: string | null
  ): Promise<string | null> {
    // Verifica se a URL é nula ou vazia
    if (!url) {
      return null;
    }

    if (!user.avatar) {
      return null;
    }

    switch (Upload.driver) {
      case "disk":
        return `${process.env.APP_API_URL_DEVELOPMENT}/files/${url}`;
      case "cloudFlare":
        const imageUrl = await getUrlImage(user.avatar);
        
        return imageUrl;
    }

    // Adiciona um domínio base à URL ou faz qualquer manipulação necessária
  }
}