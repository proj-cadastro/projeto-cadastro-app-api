import { Request, Response } from "express";
import {
  comparaCodigo,
  geraTokenRecuperacaoSenha,
  loginUsuario,
} from "./auth.service";
import { verifyToken } from "../../utils/jwt";
import { ResetCodePayload } from "../../types/auth.dto";

export async function login(req: Request, res: Response) {
  try {
    const { token, user } = await loginUsuario(req.body);
    return res.json({
      token,
      userId: user.id,
      userName: user.nome,
      user: user,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ mensagem: `Erro ao fazer login: ${(error as Error).message}` });
  }
}

export async function esqueceuSenha(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const token = await geraTokenRecuperacaoSenha(email);
    res.status(200).json({ token });
  } catch (error) {
    return res.status(400).json({ mensagem: ` ${(error as Error).message}` });
  }
}

export async function verificaCodigoRecuperacao(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;
    const { code } = req.body;

    if (!authHeader || !authHeader.startsWith(`Bearer `)) {
      throw new Error("Token não configurado");
    }
    const token = authHeader.split(" ")[1]; //remove o bearer, pegando somente o token...
    const payload = verifyToken(token) as ResetCodePayload;

    await comparaCodigo(code, payload);

    return res.status(200).json({ mensagem: `Código verificado com sucesso!` });
  } catch (error) {
    return res.status(400).json({ mensagem: `${(error as Error).message}` });

    return res
      .status(400)
      .json({
        sucesso: false,
        mensagem: "Erro ao fazer login",
        erro: (error as Error).message,
      });
  }
}
