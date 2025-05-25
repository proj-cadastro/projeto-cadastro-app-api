import { Request, Response } from 'express';
import { loginUsuario } from './auth.service';

export async function login(req: Request, res: Response) {
  try {
    const { token, userId, userName } = await loginUsuario(req.body);
    return res.json({ token, userId, userName });
  } catch (error) {
    return res.status(400).json({ mensagem: "Erro ao fazer login", erro: (error as Error).message });
  }
}
