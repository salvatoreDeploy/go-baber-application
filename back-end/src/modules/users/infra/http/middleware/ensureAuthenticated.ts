import { authConfig } from "@config/Auth";
import { AppError } from "@shared/error/AppError";
import { NextFunction, Request, Response } from "express";
import { decode, verify } from "jsonwebtoken";


interface ItokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  // Validar do Token JWT

  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("JWT token is missing", 401);
  }

  // Tratamento(separando Bearer e o token)

  const [, token] = authHeader.split(" ");

  // Verificando o token

  try {
    
    if (!authConfig.jwt.secret) {
      return
    }

    const decoded = verify(token, authConfig.jwt.secret);

    // Anexando a informação do usuario que esta fazendo a requisição

    const { sub } = decoded as ItokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    throw new AppError("Invalid JWT token");
  }
}

export { ensureAuthenticated };
