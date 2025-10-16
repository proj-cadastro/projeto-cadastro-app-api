import prisma from "../../prisma/client";
import { CreatePontoDto, UpdatePontoDto } from "../../types/ponto.dto";

export class PontoService {
  async registrarEntrada(usuarioId: string) {
    // Verificar se o usuário existe e está ativo
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    if (!usuario.isActive) {
      throw new Error("Usuário inativo não pode registrar ponto");
    }

    // Verificar se não há ponto em aberto para este usuário
    const pontoAberto = await prisma.ponto.findFirst({
      where: {
        usuarioId,
        saida: null,
      },
    });

    if (pontoAberto) {
      throw new Error(
        "Usuário já possui ponto em aberto. Registre a saída primeiro."
      );
    }

    return await prisma.ponto.create({
      data: {
        usuarioId,
        entrada: new Date(),
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });
  }

  async registrarSaida(pontoId: string) {
    const ponto = await prisma.ponto.findUnique({
      where: { id: pontoId },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });

    if (!ponto) {
      throw new Error("Ponto não encontrado");
    }

    if (ponto.saida) {
      throw new Error("Saída já foi registrada para este ponto");
    }

    const agora = new Date();
    if (agora < ponto.entrada) {
      throw new Error("Horário de saída não pode ser anterior ao de entrada");
    }

    return await prisma.ponto.update({
      where: { id: pontoId },
      data: {
        saida: agora,
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });
  }

  async create(data: CreatePontoDto & { usuarioId: string }) {
    // Verificar se o usuário existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: data.usuarioId },
    });

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    // Se há saída, validar que é posterior à entrada
    if (data.saida && data.saida < data.entrada) {
      throw new Error("Horário de saída não pode ser anterior ao de entrada");
    }

    return await prisma.ponto.create({
      data,
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    usuarioId?: string,
    dataInicio?: Date,
    dataFim?: Date
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (usuarioId) {
      where.usuarioId = usuarioId;
    }

    if (dataInicio || dataFim) {
      where.entrada = {};
      if (dataInicio) {
        where.entrada.gte = dataInicio;
      }
      if (dataFim) {
        where.entrada.lte = dataFim;
      }
    }

    const [pontos, total] = await Promise.all([
      prisma.ponto.findMany({
        skip,
        take: limit,
        where,
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
        orderBy: {
          entrada: "desc",
        },
      }),
      prisma.ponto.count({ where }),
    ]);

    return {
      pontos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const ponto = await prisma.ponto.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });

    if (!ponto) {
      throw new Error("Ponto não encontrado");
    }

    return ponto;
  }

  async update(id: string, data: UpdatePontoDto) {
    const ponto = await this.findById(id);

    // Validar horário de saída
    if (data.saida && data.saida < ponto.entrada) {
      throw new Error("Horário de saída não pode ser anterior ao de entrada");
    }

    return await prisma.ponto.update({
      where: { id },
      data,
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);

    return await prisma.ponto.delete({
      where: { id },
    });
  }

  async findByUsuarioId(usuarioId: string, dataInicio?: Date, dataFim?: Date) {
    const where: any = { usuarioId };

    if (dataInicio || dataFim) {
      where.entrada = {};
      if (dataInicio) {
        where.entrada.gte = dataInicio;
      }
      if (dataFim) {
        where.entrada.lte = dataFim;
      }
    }

    return await prisma.ponto.findMany({
      where,
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
      orderBy: {
        entrada: "desc",
      },
    });
  }

  async getPontoAbertoByUsuario(usuarioId: string) {
    return await prisma.ponto.findFirst({
      where: {
        usuarioId,
        saida: null,
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });
  }
}
