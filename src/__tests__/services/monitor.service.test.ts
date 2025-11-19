import { MonitorService } from "../../modules/monitor/monitor.service";
import prisma from "../../prisma/client";
import * as passwordGenerator from "../../utils/password-generator";
import * as hash from "../../utils/hash";

// Mock dos módulos
jest.mock("../../utils/password-generator");
jest.mock("../../utils/hash");

describe("MonitorService", () => {
  let service: MonitorService;

  beforeEach(() => {
    service = new MonitorService();
    jest.clearAllMocks();
  });

  // ------------------- CREATE -------------------
  describe("create", () => {
    it("deve criar um monitor com sucesso", async () => {
      const mockData = {
        nome: "Monitor Teste",
        email: "monitor@test.com",
        cargaHorariaSemanal: 20,
        tipo: "MONITOR" as const,
        nomePesquisaMonitoria: "Pesquisa Teste",
        professorId: "prof-123",
        horarios: [
          { diaSemana: "SEGUNDA" as const, horasTrabalho: 4 },
          { diaSemana: "TERCA" as const, horasTrabalho: 4 },
          { diaSemana: "QUARTA" as const, horasTrabalho: 4 },
          { diaSemana: "QUINTA" as const, horasTrabalho: 4 },
          { diaSemana: "SEXTA" as const, horasTrabalho: 4 },
        ],
      };

      const mockProfessor = { id: "prof-123", nome: "Professor Teste" };
      const mockMonitor = { id: "monitor-123", ...mockData };
      const mockUsuario = { id: "user-123", nome: mockData.nome, email: mockData.email };

      (prisma.professor.findUnique as jest.Mock).mockResolvedValue(mockProfessor);
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);
      (passwordGenerator.generateRandomPassword as jest.Mock).mockReturnValue("SenhaAleatoria123!");
      (hash.hashPassword as jest.Mock).mockResolvedValue("hashed_password");
      (passwordGenerator.sendMonitorCredentials as jest.Mock).mockResolvedValue(undefined);
      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) =>
        callback({
          monitor: { create: jest.fn().mockResolvedValue(mockMonitor) },
          usuario: { create: jest.fn().mockResolvedValue(mockUsuario) },
        })
      );
      (prisma.monitor.findUnique as jest.Mock).mockResolvedValue({
        ...mockMonitor,
        professor: mockProfessor,
        usuario: mockUsuario,
        horarios: mockData.horarios,
      });

      const result = await service.create(mockData);
      expect(result).toBeDefined();
      expect(prisma.professor.findUnique).toHaveBeenCalledWith({ where: { id: mockData.professorId } });
    });

    it("deve lançar erro se total de horas não corresponder à carga horária", async () => {
      const mockData = {
        nome: "Monitor Teste",
        email: "monitor@test.com",
        cargaHorariaSemanal: 20,
        tipo: "MONITOR" as const,
        nomePesquisaMonitoria: "Pesquisa Teste",
        professorId: "prof-123",
        horarios: [{ diaSemana: "SEGUNDA" as const, horasTrabalho: 4 }],
      };

      await expect(service.create(mockData)).rejects.toThrow(
        "Total de horas dos horários deve corresponder à carga horária semanal"
      );
    });

    it("deve lançar erro se professor não existir", async () => {
      const mockData = {
        nome: "Monitor Teste",
        email: "monitor@test.com",
        cargaHorariaSemanal: 20,
        tipo: "MONITOR" as const,
        nomePesquisaMonitoria: "Pesquisa Teste",
        professorId: "prof-inexistente",
        horarios: [{ diaSemana: "SEGUNDA" as const, horasTrabalho: 20 }],
      };

      (prisma.professor.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.create(mockData)).rejects.toThrow("Professor não encontrado");
    });

    it("deve lançar erro se email já estiver cadastrado", async () => {
      const mockData = {
        nome: "Monitor Teste",
        email: "monitor@test.com",
        cargaHorariaSemanal: 20,
        tipo: "MONITOR" as const,
        nomePesquisaMonitoria: "Pesquisa Teste",
        professorId: "prof-123",
        horarios: [{ diaSemana: "SEGUNDA" as const, horasTrabalho: 20 }],
      };

      (prisma.professor.findUnique as jest.Mock).mockResolvedValue({ id: "prof-123" });
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue({ id: "user-123", email: mockData.email });

      await expect(service.create(mockData)).rejects.toThrow("Já existe um usuário cadastrado com este email");
    });

    // Casos adicionais
    it("deve logar erro se falhar ao enviar email", async () => {
      const mockData = {
        nome: "Monitor Teste",
        email: "monitor@test.com",
        cargaHorariaSemanal: 20,
        tipo: "MONITOR" as const,
        nomePesquisaMonitoria: "Pesquisa Teste",
        professorId: "prof-123",
        horarios: [{ diaSemana: "SEGUNDA" as const, horasTrabalho: 20 }],
      };

      (prisma.professor.findUnique as jest.Mock).mockResolvedValue({ id: "prof-123" });
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);
      (passwordGenerator.generateRandomPassword as jest.Mock).mockReturnValue("Senha123!");
      (hash.hashPassword as jest.Mock).mockResolvedValue("hashed_password");
      (prisma.$transaction as jest.Mock).mockImplementation(async (cb) =>
        cb({
          monitor: { create: jest.fn().mockResolvedValue({ id: "monitor-123" }) },
          usuario: { create: jest.fn().mockResolvedValue({ id: "user-123" }) },
        })
      );
      (passwordGenerator.sendMonitorCredentials as jest.Mock).mockRejectedValue(new Error("Erro no email"));

      const result = await service.create(mockData);
      expect(result).toBeDefined();
      expect(passwordGenerator.sendMonitorCredentials).toHaveBeenCalled();
    });

    it("deve lançar erro se transação falhar", async () => {
      const mockData = {
        nome: "Monitor Teste",
        email: "monitor@test.com",
        cargaHorariaSemanal: 20,
        tipo: "MONITOR" as const,
        nomePesquisaMonitoria: "Pesquisa Teste",
        professorId: "prof-123",
        horarios: [{ diaSemana: "SEGUNDA" as const, horasTrabalho: 20 }],
      };

      (prisma.professor.findUnique as jest.Mock).mockResolvedValue({ id: "prof-123" });
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);
      (passwordGenerator.generateRandomPassword as jest.Mock).mockReturnValue("Senha123!");
      (hash.hashPassword as jest.Mock).mockResolvedValue("hashed_password");
      (prisma.$transaction as jest.Mock).mockRejectedValue(new Error("Erro na transação"));

      await expect(service.create(mockData)).rejects.toThrow("Erro ao criar monitor e usuário");
    });
  });

  // ------------------- FIND ALL -------------------
  describe("findAll", () => {
    it("deve listar todos os monitores com paginação", async () => {
      const mockMonitores = [{ id: "1", nome: "Monitor 1" }, { id: "2", nome: "Monitor 2" }];
      (prisma.monitor.findMany as jest.Mock).mockResolvedValue(mockMonitores);
      (prisma.monitor.count as jest.Mock).mockResolvedValue(2);

      const result = await service.findAll(1, 10);
      expect(result.monitores).toEqual(mockMonitores);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });
  });

  // ------------------- FIND BY ID -------------------
  describe("findById", () => {
    it("deve retornar um monitor por ID", async () => {
      const mockMonitor = { id: "monitor-123", nome: "Monitor Teste" };
      (prisma.monitor.findUnique as jest.Mock).mockResolvedValue(mockMonitor);

      const result = await service.findById("monitor-123");
      expect(result).toEqual(mockMonitor);
    });

    it("deve lançar erro se monitor não existir", async () => {
      (prisma.monitor.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.findById("inexistente")).rejects.toThrow("Monitor não encontrado");
    });
  });

  // ------------------- UPDATE -------------------
  describe("update", () => {
    it("deve atualizar um monitor", async () => {
      const mockMonitor = {
        id: "monitor-123",
        nome: "Monitor Antigo",
        cargaHorariaSemanal: 20,
        usuario: { id: "user-123", email: "old@test.com" },
      };
      const updateData = { nome: "Monitor Atualizado" };

      (prisma.monitor.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockMonitor)
        .mockResolvedValueOnce({ ...mockMonitor, ...updateData });

      (prisma.$transaction as jest.Mock).mockImplementation(async (cb) =>
        cb({
          monitor: { update: jest.fn().mockResolvedValue({ ...mockMonitor, ...updateData }) },
          usuario: { update: jest.fn().mockResolvedValue({}) },
        })
      );

      const result = await service.update("monitor-123", updateData);
      expect(result).toBeDefined();
      expect(result?.nome).toBe("Monitor Atualizado");
    });

    it("deve lançar erro ao atualizar horários inválidos", async () => {
      const mockMonitor = { id: "monitor-123", cargaHorariaSemanal: 20, usuario: null };
      const updateData = {
        horarios: [{ diaSemana: "SEGUNDA" as const, horasTrabalho: 4 }],
      };

      (prisma.monitor.findUnique as jest.Mock).mockResolvedValue(mockMonitor);
      await expect(service.update("monitor-123", updateData)).rejects.toThrow(
        "Total de horas dos horários deve corresponder à carga horária semanal"
      );
    });

    // Casos adicionais
    it("deve lançar erro se professorId for inválido", async () => {
      const mockMonitor = { id: "monitor-123", cargaHorariaSemanal: 20, usuario: null };
      const updateData = { professorId: "prof-invalido" };

      (prisma.monitor.findUnique as jest.Mock).mockResolvedValue(mockMonitor);
      (prisma.professor.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update("monitor-123", updateData)).rejects.toThrow("Professor não encontrado");
    });

    it("deve lançar erro se email já existir", async () => {
      const mockMonitor = {
        id: "monitor-123",
        cargaHorariaSemanal: 20,
        usuario: { id: "user-123", email: "old@test.com" },
      };
      const updateData = { email: "novo@test.com" };

      (prisma.monitor.findUnique as jest.Mock).mockResolvedValue(mockMonitor);
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue({ id: "user-999" });

      await expect(service.update("monitor-123", updateData)).rejects.toThrow("Já existe um usuário cadastrado com este email");
    });

    it("deve atualizar sem usuário vinculado (fluxo alternativo)", async () => {
      const mockMonitor = { id: "monitor-123", cargaHorariaSemanal: 20, usuario: null };
      const updateData = { nome: "Novo Nome" };

      (prisma.monitor.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockMonitor)
        .mockResolvedValueOnce({ ...mockMonitor, ...updateData });

      (prisma.$transaction as jest.Mock).mockImplementation(async (cb) =>
        cb({
          monitor: { update: jest.fn().mockResolvedValue({ ...mockMonitor, ...updateData }) },
          usuario: { update: jest.fn() },
        })
      );

      const result = await service.update("monitor-123", updateData);
      expect(result?.nome).toBe("Novo Nome");
    });
  });

  // ------------------- DELETE -------------------
  describe("delete", () => {
    it("deve deletar um monitor sem usuário", async () => {
      const mockMonitor = { id: "monitor-123", usuario: null };
      (prisma.monitor.findUnique as jest.Mock).mockResolvedValue(mockMonitor);
      (prisma.$transaction as jest.Mock).mockImplementation(async (cb) =>
        cb({
          usuario: { delete: jest.fn() },
          monitor: { delete: jest.fn().mockResolvedValue(mockMonitor) },
        })
      );

      const result = await service.delete("monitor-123");
      expect(result).toEqual(mockMonitor);
    });

    it("deve deletar um monitor com usuário vinculado", async () => {
      const mockMonitor = { id: "monitor-123", usuario: { id: "user-123" } };
      (prisma.monitor.findUnique as jest.Mock).mockResolvedValue(mockMonitor);
      (prisma.$transaction as jest.Mock).mockImplementation(async (cb) =>
        cb({
          usuario: { delete: jest.fn().mockResolvedValue({}) },
          monitor: { delete: jest.fn().mockResolvedValue(mockMonitor) },
        })
      );

      const result = await service.delete("monitor-123");
      expect(result).toEqual(mockMonitor);
    });

    // Caso adicional
    it("deve lançar erro se transação falhar ao deletar", async () => {
      const mockMonitor = { id: "monitor-123", usuario: null };
      (prisma.monitor.findUnique as jest.Mock).mockResolvedValue(mockMonitor);
      (prisma.$transaction as jest.Mock).mockRejectedValue(new Error("Erro na transação"));

      await expect(service.delete("monitor-123")).rejects.toThrow("Erro na transação");
    });
  });

  // ------------------- FIND BY PROFESSOR -------------------
  describe("findByProfessorId", () => {
    it("deve retornar monitores de um professor", async () => {
      const mockMonitores = [{ id: "1", professorId: "prof-123" }, { id: "2", professorId: "prof-123" }];
      (prisma.monitor.findMany as jest.Mock).mockResolvedValue(mockMonitores);

      const result = await service.findByProfessorId("prof-123");
      expect(result).toEqual(mockMonitores);
      expect(prisma.monitor.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { professorId: "prof-123" } }));
    });

    // Caso adicional
    it("deve retornar array vazio se não houver monitores", async () => {
      (prisma.monitor.findMany as jest.Mock).mockResolvedValue([]);
      const result = await service.findByProfessorId("prof-123");
      expect(result).toEqual([]);
    });
  });
});