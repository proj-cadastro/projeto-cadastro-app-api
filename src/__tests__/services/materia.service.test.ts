import {
  createMateria,
  getAllMaterias,
  getMateriaById,
  updateMateria,
  deleteMateria,
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
    cursoMateria: {
      deleteMany: jest.fn(),
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
    it("should update materia successfully", async () => {
      const updateData = { nome: "Programação II" };
      mockPrisma.materia.update.mockResolvedValue(mockMateria);
      mockPrisma.materia.findUnique.mockResolvedValue(mockMateriaWithRelations);

      const result = await updateMateria("materia-id-123", updateData);

      expect(mockPrisma.materia.update).toHaveBeenCalled();
      expect(mockPrisma.materia.findUnique).toHaveBeenCalled();
      expect(result).toEqual(mockMateriaWithRelations);
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
});
