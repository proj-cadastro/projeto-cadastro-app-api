import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";

const secret = process.env.JWT_SECRET || "secreto123"; // depois, configure no .env!

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token não fornecido" });

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ message: "Token inválido" });

    (req as any).user = user;
    next();
  });
}

export async function requireSuperAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;

    if (!user || !user.id) {
      return res.status(401).json({ message: "Usuário não identificado" });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: user.id },
      select: { role: true, isActive: true },
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (!usuario.isActive) {
      return res
        .status(403)
        .json({ message: "Usuário inativo. Contate o administrador." });
    }

    if (usuario.role !== "SUPER_ADMIN") {
      return res
        .status(403)
        .json({
          message:
            "Acesso negado. Apenas super administradores podem acessar este recurso.",
        });
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao verificar permissões do usuário" });
  }
}

export async function requireAdminOrSuperAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;

    if (!user || !user.id) {
      return res.status(401).json({ message: "Usuário não identificado" });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: user.id },
      select: { role: true, isActive: true },
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (!usuario.isActive) {
      return res
        .status(403)
        .json({ message: "Usuário inativo. Contate o administrador." });
    }

    if (!["SUPER_ADMIN", "ADMIN"].includes(usuario.role)) {
      return res
        .status(403)
        .json({
          message:
            "Acesso negado. Apenas administradores podem acessar este recurso.",
        });
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao verificar permissões do usuário" });
  }
}
