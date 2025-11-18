import prisma from "../../prisma/client";
import { Prisma } from "@prisma/client";
import {
  CreateMonitorDto,
  UpdateMonitorDto,
  CreateHorarioTrabalhoDto,
} from "../../types/monitor.dto";
import {
  generateRandomPassword,
  sendMonitorCredentials,
} from "../../utils/password-generator";
import { hashPassword } from "../../utils/hash";

export class MonitorService {
  async create(data: CreateMonitorDto) {
    const { horarios, ...monitorData } = data;

    // Verificar se o total de horas dos horários corresponde à carga horária semanal
    const totalHoras = horarios.reduce(
      (sum: number, h: CreateHorarioTrabalhoDto) => sum + h.horasTrabalho,
      0
    );
    if (totalHoras !== data.cargaHorariaSemanal) {
      throw new Error(
        "Total de horas dos horários deve corresponder à carga horária semanal"
      );
    }

    // Verificar se o professor existe
    const professor = await prisma.professor.findUnique({
      where: { id: data.professorId },
    });

    if (!professor) {
      throw new Error("Professor não encontrado");
    }

    // Verificar se já existe um usuário com este email
    const existingUser = await prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("Já existe um usuário cadastrado com este email");
    }

    // Gerar senha aleatória
    const senhaGerada = generateRandomPassword();
    const senhaHash = await hashPassword(senhaGerada);

    try {
      // Criar monitor e usuário em uma transação
      const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Criar o monitor
        const monitor = await tx.monitor.create({
          data: {
            ...monitorData,
            horarios: {
              create: horarios,
            },
          },
        });

        // Criar o usuário vinculado ao monitor
        const usuario = await tx.usuario.create({
          data: {
            nome: data.nome,
            email: data.email,
            senha: senhaHash,
            role: "MONITOR",
            isActive: true,
            monitorId: monitor.id,
          },
        });

        return { monitor, usuario };
      });

      // Enviar email com as credenciais (fora da transação para não travar em caso de erro de email)
      try {
        await sendMonitorCredentials(data.email, data.nome, senhaGerada);
      } catch (emailError) {
        console.error("Erro ao enviar email:", emailError);
        // Log do erro mas não falha a criação do monitor
      }

      // Buscar e retornar o monitor criado com todas as relações
      return await prisma.monitor.findUnique({
        where: { id: result.monitor.id },
        include: {
          professor: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
          horarios: true,
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
              isActive: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Erro ao criar monitor:", error);
      throw new Error("Erro ao criar monitor e usuário");
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [monitores, total] = await Promise.all([
      prisma.monitor.findMany({
        skip,
        take: limit,
        include: {
          professor: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
          horarios: true,
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
              isActive: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.monitor.count(),
    ]);

    return {
      monitores,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const monitor = await prisma.monitor.findUnique({
      where: { id },
      include: {
        professor: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        horarios: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            isActive: true,
          },
        },
      },
    });

    if (!monitor) {
      throw new Error("Monitor não encontrado");
    }

    return monitor;
  }

  async update(id: string, data: UpdateMonitorDto) {
    const monitor = await this.findById(id);

    const { horarios, ...updateData } = data;

    // Se está atualizando horários, validar
    if (horarios) {
      const cargaHoraria =
        data.cargaHorariaSemanal ?? monitor.cargaHorariaSemanal;
      const totalHoras = horarios.reduce(
        (sum: number, h: CreateHorarioTrabalhoDto) => sum + h.horasTrabalho,
        0
      );

      if (totalHoras !== cargaHoraria) {
        throw new Error(
          "Total de horas dos horários deve corresponder à carga horária semanal"
        );
      }
    }

    // Se está atualizando professor, verificar se existe
    if (data.professorId) {
      const professor = await prisma.professor.findUnique({
        where: { id: data.professorId },
      });

      if (!professor) {
        throw new Error("Professor não encontrado");
      }
    }

    // Se está atualizando o email, verificar se já existe outro usuário com este email
    if (data.email && data.email !== monitor.usuario?.email) {
      const existingUser = await prisma.usuario.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new Error("Já existe um usuário cadastrado com este email");
      }
    }

    return await prisma
      .$transaction(async (tx: Prisma.TransactionClient) => {
        // Atualizar monitor
        const updatedMonitor = await tx.monitor.update({
          where: { id },
          data: {
            ...updateData,
            ...(horarios && {
              horarios: {
                deleteMany: { monitorId: id },
                create: horarios,
              },
            }),
          },
        });

        // Se há usuário vinculado e dados de usuário foram alterados, atualizar o usuário
        if (monitor.usuario && (data.nome || data.email)) {
          await tx.usuario.update({
            where: { id: monitor.usuario.id },
            data: {
              ...(data.nome && { nome: data.nome }),
              ...(data.email && { email: data.email }),
            },
          });
        }

        return updatedMonitor;
      })
      .then(async () => {
        // Buscar e retornar o monitor atualizado com todas as relações
        return await prisma.monitor.findUnique({
          where: { id },
          include: {
            professor: {
              select: {
                id: true,
                nome: true,
                email: true,
              },
            },
            horarios: true,
            usuario: {
              select: {
                id: true,
                nome: true,
                email: true,
                isActive: true,
              },
            },
          },
        });
      });
  }

  async delete(id: string) {
    const monitor = await this.findById(id);

    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Se há usuário vinculado, remover primeiro
      if (monitor.usuario) {
        await tx.usuario.delete({
          where: { id: monitor.usuario.id },
        });
      }

      // Remover o monitor
      return await tx.monitor.delete({
        where: { id },
      });
    });
  }

  async findByProfessorId(professorId: string) {
    return await prisma.monitor.findMany({
      where: { professorId },
      include: {
        professor: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        horarios: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            isActive: true,
          },
        },
      },
    });
  }
}
