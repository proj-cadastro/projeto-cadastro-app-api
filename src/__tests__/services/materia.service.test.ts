import {
  createMateria,
  getAllMaterias,
  getMateriaById,
  updateMateria,
  deleteMateria,
  checkCoursesId,
  isMateriaUnicaEmCurso,
} from "../../modules/materia/materia.service";
import { CreateMateriaDto } from "../../types/materia.dto";

jest.mock("../../prisma/client", () => ({
  __esModule: true,
  default: {
    materia: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    curso: {
      findMany: jest.fn(),
    },
    cursoMateria: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

import prisma from "../../prisma/client";
const mockPrisma = prisma as any;

describe("Materia Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockMateria = {
    id: "materia-id-123",
    nome: "Programação I",
    cargaHoraria: 60,
    professorId: "prof-id-123",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockMateriaWithRelations = {
    ...mockMateria,
    professor: {
      id: "prof-id-123",
      nome: "Prof. João",
    },
    cursos: [
      {
        curso: {
          id: "curso-id-123",
          nome: "Engenharia de Software",
        },
      },
    ],
  };

  describe("createMateria", () => {
    it("should create materia successfully", async () => {
      const createData: CreateMateriaDto = {
        nome: "Programação I",
        cargaHoraria: 60,
        professorId: "prof-id-123",
        cursos: [{ cursoId: "curso-id-123" }],
      };

      mockPrisma.materia.create.mockResolvedValue(mockMateriaWithRelations);

      const result = await createMateria(createData);

      expect(mockPrisma.materia.create).toHaveBeenCalled();
      expect(result).toEqual(mockMateriaWithRelations);
    });

    it("should create materia without professor", async () => {
      const createData: CreateMateriaDto = {
        nome: "Programação I",
        cargaHoraria: 60,
        cursos: [],
      };

      mockPrisma.materia.create.mockResolvedValue(mockMateria);

      const result = await createMateria(createData);

      expect(mockPrisma.materia.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe("getAllMaterias", () => {
    it("should get all materias", async () => {
      mockPrisma.materia.findMany.mockResolvedValue([mockMateriaWithRelations]);

      const result = await getAllMaterias();

      expect(mockPrisma.materia.findMany).toHaveBeenCalledWith({
        include: {
          professor: true,
          cursos: {
            include: {
              curso: true,
            },
          },
        },
      });
      expect(result).toEqual([mockMateriaWithRelations]);
    });
  });

  describe("getMateriaById", () => {
    it("should get materia by id", async () => {
      const materiaId = "materia-id-123";
      mockPrisma.materia.findUnique.mockResolvedValue(mockMateriaWithRelations);

      const result = await getMateriaById(materiaId);

      expect(mockPrisma.materia.findUnique).toHaveBeenCalledWith({
        where: { id: materiaId },
        include: {
          professor: true,
          cursos: {
            include: {
              curso: true,
            },
          },
        },
      });
      expect(result).toEqual(mockMateriaWithRelations);
    });
  });

  describe("updateMateria", () => {
    it("should update materia and replace cursos when cursos provided", async () => {
      const updateData = { nome: "Programação III", cursos: [{ cursoId: "curso-id-456" }] } as any;

      mockPrisma.materia.update.mockResolvedValue(mockMateria);
      mockPrisma.cursoMateria.deleteMany.mockResolvedValue({ count: 1 });
      mockPrisma.cursoMateria.createMany = jest.fn().mockResolvedValue({ count: 1 });
      mockPrisma.materia.findUnique.mockResolvedValue({
        ...mockMateriaWithRelations,
        cursos: [{ curso: { id: "curso-id-456", nome: "Outra" } }],
      });

      const result = await updateMateria("materia-id-123", updateData);

      expect(mockPrisma.materia.update).toHaveBeenCalledWith({
        where: { id: "materia-id-123" },
        data: { nome: "Programação III" },
      });
      expect(mockPrisma.cursoMateria.deleteMany).toHaveBeenCalledWith({
        where: { materiaId: "materia-id-123" },
      });
      expect(mockPrisma.cursoMateria.createMany).toHaveBeenCalled();
      expect(mockPrisma.materia.findUnique).toHaveBeenCalled();

      // ✅ Correção para evitar TS18047
      expect(result).not.toBeNull();
      expect(result!.cursos).toBeDefined();
    });
  });

  describe("deleteMateria", () => {
    it("should delete materia successfully", async () => {
      mockPrisma.cursoMateria.deleteMany.mockResolvedValue({ count: 1 });
      mockPrisma.materia.delete.mockResolvedValue(mockMateria);

      const result = await deleteMateria("materia-id-123");

      expect(mockPrisma.materia.delete).toHaveBeenCalledWith({
        where: { id: "materia-id-123" },
      });
      expect(result).toEqual(mockMateria);
    });
  });

  describe("checkCoursesId", () => {
    it("returns true when all cursoIds exist", async () => {
      const cursoIds = ["c1", "c2"];
      mockPrisma.curso.findMany = jest.fn().mockResolvedValue([{ id: "c1" }, { id: "c2" }]);

      const result = await checkCoursesId(cursoIds);
      expect(mockPrisma.curso.findMany).toHaveBeenCalledWith({ where: { id: { in: cursoIds } }, select: { id: true } });
      expect(result).toBe(true);
    });

    it("returns false when some cursoIds are missing", async () => {
      const cursoIds = ["c1", "c2", "c3"];
      mockPrisma.curso.findMany = jest.fn().mockResolvedValue([{ id: "c1" }, { id: "c2" }]);

      const result = await checkCoursesId(cursoIds);
      expect(result).toBe(false);
    });
  });

  describe("isMateriaUnicaEmCurso", () => {
    it("returns true when count is 1", async () => {
      mockPrisma.cursoMateria.count = jest.fn().mockResolvedValue(1);
      const result = await isMateriaUnicaEmCurso("m1");
      expect(mockPrisma.cursoMateria.count).toHaveBeenCalledWith({ where: { materiaId: "m1" } });
      expect(result).toBe(true);
    });

    it("returns false when count is greater than 1", async () => {
      mockPrisma.cursoMateria.count = jest.fn().mockResolvedValue(2);
      const result = await isMateriaUnicaEmCurso("m1");
      expect(result).toBe(false);
    });
  });
});
