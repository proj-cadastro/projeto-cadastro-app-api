import prisma from "../../prisma/client";
import { CreateUsuarioDto, UpdateUsuarioDto } from "../../types/usuario.dto";
import { hashPassword } from "../../utils/hash";
import { generateToken } from "../../utils/jwt";

export async function createUsuario(data: CreateUsuarioDto) {
  const {
    nome,
    email,
    senha,
    role = "ADMIN",
    isActive = true,
    monitorId,
  } = data;

  const existingUser = await prisma.usuario.findUnique({ where: { email } });
  if (existingUser) throw new Error("Usuário já existe com este email");

  // Se monitorId foi fornecido, verificar se o monitor existe
  if (monitorId) {
    const monitor = await prisma.monitor.findUnique({
      where: { id: monitorId },
    });
    if (!monitor) throw new Error("Monitor não encontrado");

    // Verificar se o monitor já tem usuário vinculado
    const usuarioExistente = await prisma.usuario.findFirst({
      where: { monitorId },
    });
    if (usuarioExistente)
      throw new Error("Monitor já possui usuário vinculado");
  }

  const hashedSenha = await hashPassword(senha);

  const user = await prisma.usuario.create({
    data: {
      nome,
      email,
      senha: hashedSenha,
      role,
      isActive,
      monitorId,
    },
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      isActive: true,
      monitor: {
        select: {
          id: true,
          nome: true,
          tipo: true,
          cargaHorariaSemanal: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

export async function getAllUsuarios(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  const [usuarios, total] = await Promise.all([
    prisma.usuario.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        isActive: true,
        monitor: {
          select: {
            id: true,
            nome: true,
            tipo: true,
            cargaHorariaSemanal: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.usuario.count(),
  ]);

  return {
    usuarios,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getUsuarioById(id: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      isActive: true,
      monitor: {
        select: {
          id: true,
          nome: true,
          tipo: true,
          cargaHorariaSemanal: true,
          professor: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!usuario) throw new Error("Usuário não encontrado");

  return usuario;
}

export async function updateUsuario(id: string, data: UpdateUsuarioDto) {
  const usuario = await getUsuarioById(id);

  // Se está alterando o email, verificar se não existe outro usuário com o mesmo email
  if (data.email && data.email !== usuario.email) {
    const existingUser = await prisma.usuario.findUnique({
      where: { email: data.email },
    });
    if (existingUser) throw new Error("Já existe usuário com este email");
  }

  // Se monitorId foi fornecido, verificar se o monitor existe
  if (data.monitorId) {
    const monitor = await prisma.monitor.findUnique({
      where: { id: data.monitorId },
    });
    if (!monitor) throw new Error("Monitor não encontrado");

    // Se está alterando o monitor, verificar se o novo monitor já tem usuário
    if (data.monitorId !== usuario.monitor?.id) {
      const usuarioExistente = await prisma.usuario.findFirst({
        where: { monitorId: data.monitorId },
      });
      if (usuarioExistente)
        throw new Error("Monitor já possui usuário vinculado");
    }
  }

  const updateData: any = { ...data };
  if (data.senha) {
    updateData.senha = await hashPassword(data.senha);
  }

  return await prisma.usuario.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      isActive: true,
      monitor: {
        select: {
          id: true,
          nome: true,
          tipo: true,
          cargaHorariaSemanal: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function deleteUsuario(id: string) {
  await getUsuarioById(id);
  return await prisma.usuario.delete({ where: { id } });
}

export async function toggleUsuarioStatus(id: string) {
  const usuario = await getUsuarioById(id);

  return await prisma.usuario.update({
    where: { id },
    data: { isActive: !usuario.isActive },
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      isActive: true,
      monitor: {
        select: {
          id: true,
          nome: true,
          tipo: true,
          cargaHorariaSemanal: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
}
