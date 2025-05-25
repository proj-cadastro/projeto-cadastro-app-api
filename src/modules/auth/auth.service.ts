import prisma from '../../prisma/client';
import { LoginDto } from '../../types/usuario.dto';
import { comparePassword } from '../../utils/hash';
import { generateToken } from '../../utils/jwt';

export async function loginUsuario(data: LoginDto) {
  const { email, senha } = data;

  const user = await prisma.usuario.findUnique({ where: { email } });
  if (!user) throw new Error('Usuário não encontrado');

  const valid = await comparePassword(senha, user.senha);
  if (!valid) throw new Error('Senha incorreta');

  const token = generateToken({ userId: user.id, email: user.email });
  return { token, userId: user.id, userName: user.nome };
}
