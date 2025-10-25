import { PontoService } from "../../modules/ponto/ponto.service";
import prisma from "../../prisma/client";

describe("PontoService", () => {
  let service: PontoService;

  beforeEach(() => {
    service = new PontoService();
    jest.clearAllMocks();
  });

  describe("registrarEntrada", () => {
    it("deve registrar entrada com sucesso", async () => {
      const mockUsuario = {
        id: "user-123",
        nome: "Usuário Teste",
        email: "user@test.com",
        isActive: true,
      };

      const mockPonto = {
        id: "ponto-123",
        usuarioId: "user-123",
        entrada: new Date(),
        saida: null,
        usuario: mockUsuario,
      };

      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(mockUsuario);
      (prisma.ponto.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.ponto.create as jest.Mock).mockResolvedValue(mockPonto);

      const result = await service.registrarEntrada("user-123");

      expect(result).toEqual(mockPonto);
      expect(prisma.usuario.findUnique).toHaveBeenCalledWith({
        where: { id: "user-123" },
      });
      expect(prisma.ponto.findFirst).toHaveBeenCalledWith({
        where: { usuarioId: "user-123", saida: null },
      });
    });

    it("deve lançar erro se usuário não existir", async () => {
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.registrarEntrada("user-inexistente")
      ).rejects.toThrow("Usuário não encontrado");
    });

    it("deve lançar erro se usuário estiver inativo", async () => {
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue({
        id: "user-123",
        isActive: false,
      });

      await expect(service.registrarEntrada("user-123")).rejects.toThrow(
        "Usuário inativo não pode registrar ponto"
      );
    });

    it("deve lançar erro se já houver ponto em aberto", async () => {
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue({
        id: "user-123",
        isActive: true,
      });
      (prisma.ponto.findFirst as jest.Mock).mockResolvedValue({
        id: "ponto-123",
        saida: null,
      });

      await expect(service.registrarEntrada("user-123")).rejects.toThrow(
        "Usuário já possui ponto em aberto. Registre a saída primeiro."
      );
    });
  });

  describe("registrarSaida", () => {
    it("deve registrar saída com sucesso", async () => {
      const entrada = new Date("2025-01-01T08:00:00");
      const mockPonto = {
        id: "ponto-123",
        entrada,
        saida: null,
        usuario: { id: "user-123", nome: "Usuário" },
      };

      const mockPontoAtualizado = {
        ...mockPonto,
        saida: expect.any(Date),
      };

      (prisma.ponto.findUnique as jest.Mock).mockResolvedValue(mockPonto);
      (prisma.ponto.update as jest.Mock).mockResolvedValue(mockPontoAtualizado);

      const result = await service.registrarSaida("ponto-123");

      expect(result).toEqual(mockPontoAtualizado);
      expect(prisma.ponto.update).toHaveBeenCalledWith({
        where: { id: "ponto-123" },
        data: { saida: expect.any(Date) },
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
    });

    it("deve lançar erro se ponto não existir", async () => {
      (prisma.ponto.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.registrarSaida("ponto-inexistente")).rejects.toThrow(
        "Ponto não encontrado"
      );
    });

    it("deve lançar erro se saída já foi registrada", async () => {
      (prisma.ponto.findUnique as jest.Mock).mockResolvedValue({
        id: "ponto-123",
        saida: new Date(),
      });

      await expect(service.registrarSaida("ponto-123")).rejects.toThrow(
        "Saída já foi registrada para este ponto"
      );
    });
  });

  describe("create", () => {
    it("deve criar um ponto com sucesso", async () => {
      const mockUsuario = { id: "user-123" };
      const entrada = new Date();
      const saida = new Date(entrada.getTime() + 4 * 60 * 60 * 1000);

      const mockPonto = {
        id: "ponto-123",
        usuarioId: "user-123",
        entrada,
        saida,
        usuario: mockUsuario,
      };

      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(mockUsuario);
      (prisma.ponto.create as jest.Mock).mockResolvedValue(mockPonto);

      const result = await service.create({
        usuarioId: "user-123",
        entrada,
        saida,
      });

      expect(result).toEqual(mockPonto);
    });

    it("deve lançar erro se usuário não existir", async () => {
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.create({ usuarioId: "user-inexistente", entrada: new Date() })
      ).rejects.toThrow("Usuário não encontrado");
    });

    it("deve lançar erro se saída for anterior à entrada", async () => {
      const entrada = new Date("2025-01-01T08:00:00");
      const saida = new Date("2025-01-01T07:00:00");

      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue({
        id: "user-123",
      });

      await expect(
        service.create({ usuarioId: "user-123", entrada, saida })
      ).rejects.toThrow("Horário de saída não pode ser anterior ao de entrada");
    });
  });

  describe("findAll", () => {
    it("deve listar todos os pontos com paginação", async () => {
      const mockPontos = [
        { id: "1", usuarioId: "user-123" },
        { id: "2", usuarioId: "user-123" },
      ];

      (prisma.ponto.findMany as jest.Mock).mockResolvedValue(mockPontos);
      (prisma.ponto.count as jest.Mock).mockResolvedValue(2);

      const result = await service.findAll(1, 10);

      expect(result.pontos).toEqual(mockPontos);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it("deve filtrar por usuário", async () => {
      const mockPontos = [{ id: "1", usuarioId: "user-123" }];

      (prisma.ponto.findMany as jest.Mock).mockResolvedValue(mockPontos);
      (prisma.ponto.count as jest.Mock).mockResolvedValue(1);

      await service.findAll(1, 10, "user-123");

      expect(prisma.ponto.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ usuarioId: "user-123" }),
        })
      );
    });

    it("deve filtrar por período", async () => {
      const dataInicio = new Date("2025-01-01");
      const dataFim = new Date("2025-01-31");
      const mockPontos = [{ id: "1" }];

      (prisma.ponto.findMany as jest.Mock).mockResolvedValue(mockPontos);
      (prisma.ponto.count as jest.Mock).mockResolvedValue(1);

      await service.findAll(1, 10, undefined, dataInicio, dataFim);

      expect(prisma.ponto.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            entrada: { gte: dataInicio, lte: dataFim },
          }),
        })
      );
    });
  });

  describe("findById", () => {
    it("deve retornar um ponto por ID", async () => {
      const mockPonto = { id: "ponto-123", usuarioId: "user-123" };

      (prisma.ponto.findUnique as jest.Mock).mockResolvedValue(mockPonto);

      const result = await service.findById("ponto-123");

      expect(result).toEqual(mockPonto);
    });

    it("deve lançar erro se ponto não existir", async () => {
      (prisma.ponto.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findById("inexistente")).rejects.toThrow(
        "Ponto não encontrado"
      );
    });
  });

  describe("update", () => {
    it("deve atualizar um ponto", async () => {
      const entrada = new Date("2025-01-01T08:00:00");
      const saida = new Date("2025-01-01T12:00:00");
      const mockPonto = {
        id: "ponto-123",
        entrada,
        saida: null,
      };

      (prisma.ponto.findUnique as jest.Mock).mockResolvedValue(mockPonto);
      (prisma.ponto.update as jest.Mock).mockResolvedValue({
        ...mockPonto,
        saida,
      });

      const result = await service.update("ponto-123", { saida });

      expect(result.saida).toEqual(saida);
    });

    it("deve lançar erro se saída for anterior à entrada", async () => {
      const entrada = new Date("2025-01-01T08:00:00");
      const saida = new Date("2025-01-01T07:00:00");

      (prisma.ponto.findUnique as jest.Mock).mockResolvedValue({
        id: "ponto-123",
        entrada,
      });

      await expect(service.update("ponto-123", { saida })).rejects.toThrow(
        "Horário de saída não pode ser anterior ao de entrada"
      );
    });
  });

  describe("delete", () => {
    it("deve deletar um ponto", async () => {
      const mockPonto = { id: "ponto-123" };

      (prisma.ponto.findUnique as jest.Mock).mockResolvedValue(mockPonto);
      (prisma.ponto.delete as jest.Mock).mockResolvedValue(mockPonto);

      const result = await service.delete("ponto-123");

      expect(result).toEqual(mockPonto);
    });
  });

  describe("findByUsuarioId", () => {
    it("deve retornar pontos de um usuário", async () => {
      const mockPontos = [
        { id: "1", usuarioId: "user-123" },
        { id: "2", usuarioId: "user-123" },
      ];

      (prisma.ponto.findMany as jest.Mock).mockResolvedValue(mockPontos);

      const result = await service.findByUsuarioId("user-123");

      expect(result).toEqual(mockPontos);
      expect(prisma.ponto.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ usuarioId: "user-123" }),
        })
      );
    });

    it("deve filtrar por período ao buscar por usuário", async () => {
      const dataInicio = new Date("2025-01-01");
      const dataFim = new Date("2025-01-31");

      (prisma.ponto.findMany as jest.Mock).mockResolvedValue([]);

      await service.findByUsuarioId("user-123", dataInicio, dataFim);

      expect(prisma.ponto.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            usuarioId: "user-123",
            entrada: { gte: dataInicio, lte: dataFim },
          }),
        })
      );
    });
  });

  describe("getPontoAbertoByUsuario", () => {
    it("deve retornar ponto em aberto do usuário", async () => {
      const mockPonto = {
        id: "ponto-123",
        usuarioId: "user-123",
        saida: null,
      };

      (prisma.ponto.findFirst as jest.Mock).mockResolvedValue(mockPonto);

      const result = await service.getPontoAbertoByUsuario("user-123");

      expect(result).toEqual(mockPonto);
      expect(prisma.ponto.findFirst).toHaveBeenCalledWith({
        where: { usuarioId: "user-123", saida: null },
        include: expect.any(Object),
      });
    });

    it("deve retornar null se não houver ponto em aberto", async () => {
      (prisma.ponto.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await service.getPontoAbertoByUsuario("user-123");

      expect(result).toBeNull();
    });
  });
});
