import {
  loginUsuario,
  geraTokenRecuperacaoSenha,
} from "../../modules/auth/auth.service";
import { LoginDto } from "../../types/usuario.dto";

// Mock do Prisma Client
jest.mock("../../prisma/client", () => ({
  __esModule: true,
  default: {
    usuario: {
      findUnique: jest.fn(),
    },
  },
}));

// Mock dos utilitários
jest.mock("../../utils/hash", () => ({
  comparePassword: jest.fn(),
}));

jest.mock("../../utils/jwt", () => ({
  generateToken: jest.fn(),
}));

jest.mock("../../utils/reset-code", () => ({
  generateResetCode: jest.fn(),
  sendResetCode: jest.fn(),
}));

import prisma from "../../prisma/client";
import { comparePassword } from "../../utils/hash";
import { generateToken } from "../../utils/jwt";
import { generateResetCode, sendResetCode } from "../../utils/reset-code";

const mockPrisma = prisma as any;
const mockComparePassword = comparePassword as jest.MockedFunction<
  typeof comparePassword
>;
const mockGenerateToken = generateToken as jest.MockedFunction<
  typeof generateToken
>;
const mockGenerateResetCode = generateResetCode as jest.MockedFunction<
  typeof generateResetCode
>;
const mockSendResetCode = sendResetCode as jest.MockedFunction<
  typeof sendResetCode
>;

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loginUsuario", () => {
    const mockLoginData: LoginDto = {
      email: "test@example.com",
      senha: "password123",
    };

    const mockUser = {
      id: "user-id-123",
      nome: "Test User",
      email: "test@example.com",
      senha: "hashed-password",
      role: "ADMIN" as const,
      isActive: true,
      monitor: null,
    };

    it("should login user successfully", async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(mockUser);
      mockComparePassword.mockResolvedValue(true);
      mockGenerateToken.mockReturnValue("mocked-token");

      const result = await loginUsuario(mockLoginData);

      expect(result).toEqual({
        token: "mocked-token",
        user: {
          id: "user-id-123",
          nome: "Test User",
          email: "test@example.com",
          role: "ADMIN",
          monitor: null,
        },
      });
    });

    it("should throw error when user is not found", async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(null);

      await expect(loginUsuario(mockLoginData)).rejects.toThrow(
        "Usuário não encontrado"
      );
    });

    it("should throw error when user is inactive", async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      mockPrisma.usuario.findUnique.mockResolvedValue(inactiveUser);

      await expect(loginUsuario(mockLoginData)).rejects.toThrow(
        "Usuário inativo. Contate o administrador para reativar sua conta."
      );
    });

    it("should throw error when password is incorrect", async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(mockUser);
      mockComparePassword.mockResolvedValue(false);

      await expect(loginUsuario(mockLoginData)).rejects.toThrow(
        "Senha incorreta"
      );
    });
  });

  describe("geraTokenRecuperacaoSenha", () => {
    const mockEmail = "test@example.com";
    const mockUser = {
      id: "user-id-123",
      email: "test@example.com",
    };

    it("should generate recovery token successfully", async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(mockUser);
      mockGenerateResetCode.mockResolvedValue("123456");
      mockSendResetCode.mockResolvedValue(undefined);
      mockGenerateToken.mockReturnValue("recovery-token");

      const result = await geraTokenRecuperacaoSenha(mockEmail);

      expect(result).toBe("recovery-token");
      expect(mockGenerateResetCode).toHaveBeenCalled();
      expect(mockSendResetCode).toHaveBeenCalledWith(
        "test@example.com",
        "123456"
      );
    });

    it("should throw error when user is not found", async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(null);

      await expect(geraTokenRecuperacaoSenha(mockEmail)).rejects.toThrow(
        "Usuário não encontrado"
      );
    });
  });
});
