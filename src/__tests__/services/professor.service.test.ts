import {
  createProfessor,
  createManyProfessors,
  getAllProfessores,
  getProfessorById,
  updateProfessor,
  deleteProfessor,
  isProfessorExists,
} from "../../modules/professor/professor.service";
import { CreateProfessorDto } from "../../types/professor.dto";

jest.mock("../../prisma/client", () => ({
  __esModule: true,
  default: {
    professor: {
      create: jest.fn(),
      createMany: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import prisma from "../../prisma/client";
const mockPrisma = prisma as any;

describe("Professor Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockProfessor = {
    id: "prof-id-123",
    nome: "Prof. João Silva",
    email: "joao@example.com",
    lattes: "http://lattes.cnpq.br/123456789",
    titulacao: "DOUTOR",
    idUnidade: "unidade-id-123",
    referencia: "REF123",
    statusAtividade: "ATIVO",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("createProfessor", () => {
    it("should create a professor successfully", async () => {
      const createData: CreateProfessorDto = {
        nome: "Prof. João Silva",
        email: "joao@example.com",
        lattes: "http://lattes.cnpq.br/123456789",
        titulacao: "DOUTOR" as any,
        idUnidade: "unidade-id-123",
        referencia: "REF123" as any,
        statusAtividade: "ATIVO" as any,
      };
      mockPrisma.professor.create.mockResolvedValue(mockProfessor);

      const result = await createProfessor(createData);

      expect(mockPrisma.professor.create).toHaveBeenCalledWith({
        data: createData,
      });
      expect(result).toEqual(mockProfessor);
    });
  });

  describe("createManyProfessors", () => {
    it("should create many professors successfully", async () => {
      const professorsData: CreateProfessorDto[] = [
        {
          nome: "Prof. João Silva",
          email: "joao@example.com",
          lattes: "http://lattes.cnpq.br/123456789",
          titulacao: "DOUTOR" as any,
          idUnidade: "unidade-id-123",
          referencia: "REF123" as any,
          statusAtividade: "ATIVO" as any,
        },
      ];
      const createManyResult = { count: 1 };
      mockPrisma.professor.createMany.mockResolvedValue(createManyResult);

      const result = await createManyProfessors(professorsData);

      expect(mockPrisma.professor.createMany).toHaveBeenCalledWith({
        data: professorsData,
      });
      expect(result).toEqual(createManyResult);
    });
  });

  describe("getAllProfessores", () => {
    it("should get all professors without filters", async () => {
      mockPrisma.professor.findMany.mockResolvedValue([mockProfessor]);

      const result = await getAllProfessores();

      expect(mockPrisma.professor.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockProfessor]);
    });

    it("should get professors with name filter", async () => {
      const filters = { nome: "João" };
      mockPrisma.professor.findMany.mockResolvedValue([mockProfessor]);

      const result = await getAllProfessores(filters);

      expect(mockPrisma.professor.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockProfessor]);
    });
  });

  describe("getProfessorById", () => {
    it("should get professor by id", async () => {
      const mockProfessorFull = {
        ...mockProfessor,
        materias: [],
        cursoCoordenado: null,
      };
      mockPrisma.professor.findUnique.mockResolvedValue(mockProfessorFull);

      const result = await getProfessorById("prof-id-123");

      expect(mockPrisma.professor.findUnique).toHaveBeenCalled();
      expect(result).toEqual(mockProfessorFull);
    });
  });

  describe("updateProfessor", () => {
    it("should update professor successfully", async () => {
      const updateData = { nome: "Prof. João Silva Updated" };
      const mockProfessorFull = {
        ...mockProfessor,
        nome: "Prof. João Silva Updated",
        materias: [],
        cursoCoordenado: null,
      };
      mockPrisma.professor.update.mockResolvedValue(mockProfessorFull);
      mockPrisma.professor.findUnique.mockResolvedValue(mockProfessorFull);

      const result = await updateProfessor("prof-id-123", updateData);

      expect(mockPrisma.professor.update).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe("deleteProfessor", () => {
    it("should delete professor successfully", async () => {
      mockPrisma.professor.delete.mockResolvedValue(mockProfessor);

      const result = await deleteProfessor("prof-id-123");

      expect(mockPrisma.professor.delete).toHaveBeenCalledWith({
        where: { id: "prof-id-123" },
      });
      expect(result).toEqual(mockProfessor);
    });
  });

  describe("isProfessorExists", () => {
    it("should return true when professor exists", async () => {
      mockPrisma.professor.findUnique.mockResolvedValue(mockProfessor);

      const result = await isProfessorExists("prof-id-123");

      expect(result).toBe(true);
    });

    it("should return false when professor does not exist", async () => {
      mockPrisma.professor.findUnique.mockResolvedValue(null);

      const result = await isProfessorExists("prof-id-123");

      expect(result).toBe(false);
    });
  });
});
