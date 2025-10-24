import {
  createCurso,
  getAllCursos,
  getCursoById,
  updateCurso,
  deleteCurso,
  isCursoExists,
  areCursosExist,
  getCursosByCoordenadorId,
} from "../../modules/curso/curso.service";
import { CreateCursoDto } from "../../types/curso.dto";

jest.mock("../../prisma/client", () => ({
  __esModule: true,
  default: {
    curso: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));

import prisma from "../../prisma/client";
const mockPrisma = prisma as any;

describe("Curso Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCurso = {
    id: "curso-id-123",
    nome: "Engenharia de Software",
    codigo: "ES001",
    sigla: "ES",
    modelo: "BACHARELADO",
    coordenadorId: "prof-id-123",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("createCurso", () => {
    it("should create a curso successfully", async () => {
      const createData: CreateCursoDto = {
        nome: "Engenharia de Software",
        codigo: "ES001",
        sigla: "ES",
        modelo: "BACHARELADO" as any,
        coordenadorId: "prof-id-123",
      };
      mockPrisma.curso.create.mockResolvedValue(mockCurso);

      const result = await createCurso(createData);

      expect(mockPrisma.curso.create).toHaveBeenCalledWith({
        data: createData,
      });
      expect(result).toEqual(mockCurso);
    });
  });

  describe("getAllCursos", () => {
    it("should get all cursos with relations", async () => {
      mockPrisma.curso.findMany.mockResolvedValue([mockCurso]);

      const result = await getAllCursos();

      expect(mockPrisma.curso.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockCurso]);
    });
  });

  describe("getCursoById", () => {
    it("should get curso by id with relations", async () => {
      const cursoId = "curso-id-123";
      mockPrisma.curso.findUnique.mockResolvedValue(mockCurso);

      const result = await getCursoById(cursoId);

      expect(mockPrisma.curso.findUnique).toHaveBeenCalled();
      expect(result).toEqual(mockCurso);
    });

    it("should return null when curso not found", async () => {
      const cursoId = "invalid-id";
      mockPrisma.curso.findUnique.mockResolvedValue(null);

      const result = await getCursoById(cursoId);

      expect(result).toBeNull();
    });
  });

  describe("updateCurso", () => {
    it("should update curso successfully", async () => {
      const cursoId = "curso-id-123";
      const updateData = { nome: "Engenharia de Software Atualizada" };
      mockPrisma.curso.update.mockResolvedValue(mockCurso);
      mockPrisma.curso.findUnique.mockResolvedValue(mockCurso);

      const result = await updateCurso(cursoId, updateData);

      expect(mockPrisma.curso.update).toHaveBeenCalled();
      expect(result).toEqual(mockCurso);
    });
  });

  describe("deleteCurso", () => {
    it("should delete curso successfully", async () => {
      const cursoId = "curso-id-123";
      mockPrisma.curso.delete.mockResolvedValue(mockCurso);

      const result = await deleteCurso(cursoId);

      expect(mockPrisma.curso.delete).toHaveBeenCalledWith({
        where: { id: cursoId },
      });
      expect(result).toEqual(mockCurso);
    });
  });

  describe("isCursoExists", () => {
    it("should return true when curso exists", async () => {
      const cursoId = "curso-id-123";
      mockPrisma.curso.findUnique.mockResolvedValue(mockCurso);

      const result = await isCursoExists(cursoId);

      expect(result).toBe(true);
    });

    it("should return false when curso does not exist", async () => {
      const cursoId = "curso-id-123";
      mockPrisma.curso.findUnique.mockResolvedValue(null);

      const result = await isCursoExists(cursoId);

      expect(result).toBe(false);
    });
  });

  describe("areCursosExist", () => {
    it("should return true when all cursos exist (string array)", async () => {
      const cursoIds = ["curso-id-1", "curso-id-2", "curso-id-3"];
      mockPrisma.curso.count.mockResolvedValue(3);

      const result = await areCursosExist(cursoIds);

      expect(mockPrisma.curso.count).toHaveBeenCalledWith({
        where: { id: { in: cursoIds } },
      });
      expect(result).toBe(true);
    });

    it("should return false when not all cursos exist (string array)", async () => {
      const cursoIds = ["curso-id-1", "curso-id-2", "curso-id-3"];
      mockPrisma.curso.count.mockResolvedValue(2);

      const result = await areCursosExist(cursoIds);

      expect(result).toBe(false);
    });

    it("should return true when all cursos exist (object array with cursoId)", async () => {
      const cursos = [
        { cursoId: "curso-id-1" },
        { cursoId: "curso-id-2" },
        { cursoId: "curso-id-3" },
      ];
      mockPrisma.curso.count.mockResolvedValue(3);

      const result = await areCursosExist(cursos);

      expect(mockPrisma.curso.count).toHaveBeenCalledWith({
        where: { id: { in: ["curso-id-1", "curso-id-2", "curso-id-3"] } },
      });
      expect(result).toBe(true);
    });

    it("should return false when not all cursos exist (object array)", async () => {
      const cursos = [{ cursoId: "curso-id-1" }, { cursoId: "curso-id-2" }];
      mockPrisma.curso.count.mockResolvedValue(1);

      const result = await areCursosExist(cursos);

      expect(result).toBe(false);
    });
  });

  describe("getCursosByCoordenadorId", () => {
    it("should get cursos by coordenador id", async () => {
      const coordenadorId = "prof-id-123";
      const cursos = [mockCurso, { ...mockCurso, id: "curso-id-456" }];
      mockPrisma.curso.findMany.mockResolvedValue(cursos);

      const result = await getCursosByCoordenadorId(coordenadorId);

      expect(mockPrisma.curso.findMany).toHaveBeenCalledWith({
        where: { coordenadorId },
      });
      expect(result).toEqual(cursos);
    });

    it("should return empty array when coordenador has no cursos", async () => {
      const coordenadorId = "prof-id-456";
      mockPrisma.curso.findMany.mockResolvedValue([]);

      const result = await getCursosByCoordenadorId(coordenadorId);

      expect(result).toEqual([]);
    });
  });
});
