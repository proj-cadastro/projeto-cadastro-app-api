import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../prisma/client';
import { LoginDto } from '../../types/usuario.dto';
import { comparePassword } from '../../utils/hash';
import { generateToken } from '../../utils/jwt';
import { generateResetCode, sendResetCode } from '../../utils/reset-code';
import { ResetCodePayload } from '../../types/auth.dto';

export async function loginUsuario(data: LoginDto) {
  const { email, senha } = data;

  const user = await prisma.usuario.findUnique({ where: { email } });
  if (!user) throw new Error('Usuário não encontrado');

  const valid = await comparePassword(senha, user.senha);
  if (!valid) throw new Error('Senha incorreta');

  const token = generateToken({ userId: user.id, email: user.email });
  return { token, userId: user.id, userName: user.nome };
}

export async function geraTokenRecuperacaoSenha(email: string) {
  const user = await prisma.usuario.findUnique({ where: { email } });
  if (!user) throw new Error('Usuário não encontrado');

  const code = await generateResetCode()

  await sendResetCode(user.email, code)
  return generateToken({ userId: user.id, code }, "10m")

}

export async function comparaCodigo(codeWrited: string, payload: ResetCodePayload) {

  if (payload.exp * 1000 < Date.now()) {
    throw new Error("Código expirado, por favor, tente novamente")
  }

  if (codeWrited !== payload.code) {
    throw new Error("O código digitado está incorreto. Verifique e tente novamente.")
  }


}
