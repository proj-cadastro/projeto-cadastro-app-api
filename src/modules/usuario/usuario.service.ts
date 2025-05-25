import prisma from '../../prisma/client';
import { CreateUsuarioDto } from '../../types/usuario.dto';
import { hashPassword } from '../../utils/hash';
import { generateToken } from '../../utils/jwt';

export async function createUsuario(data: CreateUsuarioDto) {
  const { nome, email, senha } = data;

  const existingUser = await prisma.usuario.findUnique({ where: { email } });
  if (existingUser) throw new Error('Usuário já existe com este email');

  const hashedSenha = await hashPassword(senha);

  const user = await prisma.usuario.create({
  data: { nome, email, senha: hashedSenha },
  select: { id: true, nome: true, email: true }
});


  return user;
}

export async function getAllUsuarios() {
  return await prisma.usuario.findMany({ select: { id: true, nome: true, email: true } });
}

export async function getUsuarioById(id: number) {
  return await prisma.usuario.findUnique({
    where: { id },
    select: { id: true, nome: true, email: true },
  });
}

export async function updateUsuario(id: number, data: Partial<CreateUsuarioDto>) {
  if (data.senha) data.senha = await hashPassword(data.senha);
  return await prisma.usuario.update({
    where: { id },
    data,
    select: { id: true, nome: true, email: true }
  });
}

export async function deleteUsuario(id: number) {
  return await prisma.usuario.delete({ where: { id } });
}
