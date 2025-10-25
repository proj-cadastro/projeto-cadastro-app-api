import {
  createUsuario,
  getAllUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  toggleUsuarioStatus,
} from "../../modules/usuario/usuario.service";
import { CreateUsuarioDto, UpdateUsuarioDto } from "../../types/usuario.dto";

jest.mock("../../prisma/client", () => ({
  __esModule: true,
  default: {
    usuario: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    monitor: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("../../utils/hash", () => ({
  hashPassword: jest.fn(),
}));

import prisma from "../../prisma/client";
import { hashPassword } from "../../utils/hash";

const mockPrisma = prisma as any;
const mockHashPassword = hashPassword as jest.MockedFunction<
  typeof hashPassword
>;

describe("Usuario Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = {
    id: "user-id-123",
    nome: "Test User",
    email: "test@example.com",
    role: "ADMIN" as const,
    isActive: true,
    monitor: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserWithMonitor = {
    ...mockUser,
    monitor: {
      id: "monitor-id-123",
      nome: "Monitor Test",
      tipo: "MONITOR" as const,
      cargaHorariaSemanal: 20,
    },
  };

  describe("createUsuario", () => {
    it("should create usuario successfully", async () => {
      const createData: CreateUsuarioDto = {
        nome: "Test User",
        email: "test@example.com",
        senha: "password123",
        role: "ADMIN",
      };

      mockPrisma.usuario.findUnique.mockResolvedValue(null);
      mockHashPassword.mockResolvedValue("hashed-password");
      mockPrisma.usuario.create.mockResolvedValue(mockUser);

      const result = await createUsuario(createData);

      expect(mockHashPassword).toHaveBeenCalledWith("password123");
      expect(mockPrisma.usuario.create).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it("should create usuario with default values", async () => {
      const createData: CreateUsuarioDto = {
        nome: "Test User",
        email: "test@example.com",
        senha: "password123",
      };

      mockPrisma.usuario.findUnique.mockResolvedValue(null);
      mockHashPassword.mockResolvedValue("hashed-password");
      mockPrisma.usuario.create.mockResolvedValue(mockUser);

      const result = await createUsuario(createData);

      expect(result).toBeDefined();
      expect(mockPrisma.usuario.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            role: "ADMIN",
            isActive: true,
          }),
        })
      );
    });

    it("should create usuario with monitorId successfully", async () => {
      const createData: CreateUsuarioDto = {
        nome: "Test User",
        email: "test@example.com",
        senha: "password123",
        role: "MONITOR",
        monitorId: "monitor-id-123",
      };

      mockPrisma.usuario.findUnique.mockResolvedValue(null);
      mockPrisma.monitor.findUnique.mockResolvedValue({ id: "monitor-id-123" });
      mockPrisma.usuario.findFirst.mockResolvedValue(null);
      mockHashPassword.mockResolvedValue("hashed-password");
      mockPrisma.usuario.create.mockResolvedValue(mockUserWithMonitor);

      const result = await createUsuario(createData);

      expect(mockPrisma.monitor.findUnique).toHaveBeenCalledWith({
        where: { id: "monitor-id-123" },
      });
      expect(result).toEqual(mockUserWithMonitor);
    });

    it("should throw error when user already exists", async () => {
      const createData: CreateUsuarioDto = {
        nome: "Test User",
        email: "test@example.com",
        senha: "password123",
        role: "ADMIN",
      };

      mockPrisma.usuario.findUnique.mockResolvedValue(mockUser);

      await expect(createUsuario(createData)).rejects.toThrow(
        "Usuário já existe com este email"
      );
    });

    it("should throw error when monitor not found", async () => {
      const createData: CreateUsuarioDto = {
        nome: "Test User",
        email: "test@example.com",
        senha: "password123",
        role: "MONITOR",
        monitorId: "invalid-monitor-id",
      };

      mockPrisma.usuario.findUnique.mockResolvedValue(null);
      mockPrisma.monitor.findUnique.mockResolvedValue(null);

      await expect(createUsuario(createData)).rejects.toThrow(
        "Monitor não encontrado"
      );
    });

    it("should throw error when monitor already has user", async () => {
      const createData: CreateUsuarioDto = {
        nome: "Test User",
        email: "test@example.com",
        senha: "password123",
        role: "MONITOR",
        monitorId: "monitor-id-123",
      };

      mockPrisma.usuario.findUnique.mockResolvedValue(null);
      mockPrisma.monitor.findUnique.mockResolvedValue({ id: "monitor-id-123" });
      mockPrisma.usuario.findFirst.mockResolvedValue(mockUser);

      await expect(createUsuario(createData)).rejects.toThrow(
        "Monitor já possui usuário vinculado"
      );
    });
  });

  describe("getAllUsuarios", () => {
    it("should get all users with pagination", async () => {
      mockPrisma.usuario.findMany.mockResolvedValue([mockUser]);
      mockPrisma.usuario.count.mockResolvedValue(1);

      const result = await getAllUsuarios(1, 10);

      expect(mockPrisma.usuario.findMany).toHaveBeenCalled();
      expect(mockPrisma.usuario.count).toHaveBeenCalled();
      expect(result.usuarios).toEqual([mockUser]);
      expect(result.total).toBe(1);
    });
  });

  describe("getUsuarioById", () => {
    it("should get user by id", async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(mockUser);

      const result = await getUsuarioById("user-id-123");

      expect(mockPrisma.usuario.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "user-id-123" },
        })
      );
      expect(result).toEqual(mockUser);
    });

    it("should throw error when user not found", async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(null);

      await expect(getUsuarioById("invalid-id")).rejects.toThrow(
        "Usuário não encontrado"
      );
    });
  });

  describe("updateUsuario", () => {
    it("should update user successfully", async () => {
      const updateData: UpdateUsuarioDto = { nome: "Updated Name" };
      mockPrisma.usuario.update.mockResolvedValue(mockUser);
      mockPrisma.usuario.findUnique.mockResolvedValue(mockUser);

      const result = await updateUsuario("user-id-123", updateData);

      expect(mockPrisma.usuario.update).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it("should hash password when updating senha", async () => {
      const updateData: UpdateUsuarioDto = { senha: "newPassword123" };
      mockHashPassword.mockResolvedValue("new-hashed-password");
      mockPrisma.usuario.update.mockResolvedValue(mockUser);
      mockPrisma.usuario.findUnique.mockResolvedValue(mockUser);

      await updateUsuario("user-id-123", updateData);

      expect(mockHashPassword).toHaveBeenCalledWith("newPassword123");
    });

    it("should throw error when updating email to existing one", async () => {
      const updateData: UpdateUsuarioDto = { email: "existing@example.com" };
      mockPrisma.usuario.findUnique
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce({
          id: "other-user-id",
          email: "existing@example.com",
        });

      await expect(updateUsuario("user-id-123", updateData)).rejects.toThrow(
        "Já existe usuário com este email"
      );
    });

    it("should allow updating to same email", async () => {
      const updateData: UpdateUsuarioDto = { email: "test@example.com" };
      mockPrisma.usuario.findUnique.mockResolvedValue(mockUser);
      mockPrisma.usuario.update.mockResolvedValue(mockUser);

      await updateUsuario("user-id-123", updateData);

      expect(mockPrisma.usuario.update).toHaveBeenCalled();
    });

    it("should throw error when updating to non-existent monitor", async () => {
      const updateData: UpdateUsuarioDto = { monitorId: "invalid-monitor" };
      mockPrisma.usuario.findUnique.mockResolvedValue(mockUser);
      mockPrisma.monitor.findUnique.mockResolvedValue(null);

      await expect(updateUsuario("user-id-123", updateData)).rejects.toThrow(
        "Monitor não encontrado"
      );
    });

    it("should throw error when monitor already has another user", async () => {
      const updateData: UpdateUsuarioDto = { monitorId: "monitor-id-456" };
      mockPrisma.usuario.findUnique.mockResolvedValue(mockUser);
      mockPrisma.monitor.findUnique.mockResolvedValue({ id: "monitor-id-456" });
      mockPrisma.usuario.findFirst.mockResolvedValue({ id: "other-user-id" });

      await expect(updateUsuario("user-id-123", updateData)).rejects.toThrow(
        "Monitor já possui usuário vinculado"
      );
    });

    it("should allow updating to same monitor", async () => {
      const updateData: UpdateUsuarioDto = {
        monitorId: "monitor-id-123",
        nome: "Updated",
      };
      mockPrisma.usuario.findUnique.mockResolvedValue(mockUserWithMonitor);
      mockPrisma.monitor.findUnique.mockResolvedValue({ id: "monitor-id-123" });
      mockPrisma.usuario.update.mockResolvedValue(mockUserWithMonitor);

      await updateUsuario("user-id-123", updateData);

      expect(mockPrisma.usuario.update).toHaveBeenCalled();
    });
  });

  describe("deleteUsuario", () => {
    it("should delete user successfully", async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(mockUser);
      mockPrisma.usuario.delete.mockResolvedValue(mockUser);

      const result = await deleteUsuario("user-id-123");

      expect(mockPrisma.usuario.delete).toHaveBeenCalledWith({
        where: { id: "user-id-123" },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe("toggleUsuarioStatus", () => {
    it("should toggle user status from active to inactive", async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      mockPrisma.usuario.findUnique.mockResolvedValue(mockUser);
      mockPrisma.usuario.update.mockResolvedValue(inactiveUser);

      const result = await toggleUsuarioStatus("user-id-123");

      expect(mockPrisma.usuario.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "user-id-123" },
          data: { isActive: false },
        })
      );
      expect(result.isActive).toBe(false);
    });

    it("should toggle user status from inactive to active", async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      mockPrisma.usuario.findUnique.mockResolvedValue(inactiveUser);
      mockPrisma.usuario.update.mockResolvedValue(mockUser);

      const result = await toggleUsuarioStatus("user-id-123");

      expect(mockPrisma.usuario.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "user-id-123" },
          data: { isActive: true },
        })
      );
      expect(result.isActive).toBe(true);
    });
  });
});
