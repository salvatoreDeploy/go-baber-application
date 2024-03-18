import { Request, Response } from "express";
import { ListUsersUseCase } from "./ListUsersUseCase";
import { container } from "@shared/container";

class ListUsersController {
  async handle(request: Request, response: Response) {

    const listUsersUseCase = container.resolve<ListUsersUseCase>(ListUsersUseCase)

    const allUsers = await listUsersUseCase.execute();

    return response.json(allUsers);
  }
}

export { ListUsersController };
