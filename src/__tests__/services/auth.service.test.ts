import {
  loginUsuario,
  geraTokenRecuperacaoSenha,
  comparaCodigo,
  resetarSenha,
  alterarSenha,
} from "../../modules/auth/auth.service";
import prisma from "../../prisma/client";
import { comparePassword, hashPassword } from "../../utils/hash";
import { generateToken } from "../../utils/jwt";
import { generateResetCode, sendResetCode } from "../../utils/reset-code";
import { ResetCodePayload, ResetPasswordDto, ChangePasswordDto } from "../../types/auth.dto";

// Mocks
jest.mock("../../prisma/client", () => ({
  __esModule: true,
  default: {
    usuario: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("../../utils/hash", () => ({
  comparePassword: jest.fn(),
  hashPassword: jest.fn(),
}));

jest.mock("../../utils/jwt", () => ({
  generateToken: jest.fn(),
}));

jest.mock("../../utils/reset-code", () => ({
  generateResetCode: jest.fn(),
  sendResetCode: jest.fn(),
}));

const mockPrisma = prisma as any;
const mockComparePassword = comparePassword as jest.MockedFunction<typeof comparePassword>;
const mockHashPassword = hashPassword as jest.MockedFunction<typeof hashPassword>;
const mockGenerateToken = generateToken as jest.MockedFunction<typeof generateToken>;
const mockGenerateResetCode = generateResetCode as jest.MockedFunction<typeof generateResetCode>;
const mockSendResetCode = sendResetCode as jest.MockedFunction<typeof sendResetCode>;

describe("Auth Service", () => {
  beforeEach(() => jest.clearAllMocks());

  // ✅ loginUsuario
  describe("loginUsuario", () => {
    const mockLoginData = { email: "test@example.com", senha: "password123" };
    const mockUser = {
      id: "user-id",
      nome: "Test User",
      email: "test@example.com",
      senha: "hashed-password",
      role: "ADMIN",
      isActive: true,
      monitor: null,
    };

    it("should login successfully", async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(mockUser);
      mockComparePassword.mockResolvedValue(true);
      mockGenerateToken.mockReturnValue("mock-token");

      const result = await loginUsuario(mockLoginData);
      expect(result.token).toBe("mock-token");
      expect(result.user.email).toBe("test@example.com");
    });

    it("should throw if user not found", async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(null);
      await expect(loginUsuario(mockLoginData)).rejects.toThrow("Usuário não encontrado");
    });

    it("should throw if user inactive", async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue({ ...mockUser, isActive: false });
      await expect(loginUsuario(mockLoginData)).rejects.toThrow("Usuário inativo");
    });

    it("should throw if password incorrect", async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(mockUser);
      mockComparePassword.mockResolvedValue(false);
      await expect(loginUsuario(mockLoginData)).rejects.toThrow("Senha incorreta");
    });
  });

  // ✅ geraTokenRecuperacaoSenha
  describe("geraTokenRecuperacaoSenha", () => {
    const mockEmail = "test@example.com";
    const mockUser = { id: "user-id", email: mockEmail };

    it("should generate recovery token", async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(mockUser);
      mockGenerateResetCode.mockResolvedValue("123456");
      mockSendResetCode.mockResolvedValue(undefined);
      mockGenerateToken.mockReturnValue("recovery-token");

      const result = await geraTokenRecuperacaoSenha(mockEmail);
      expect(result).toBe("recovery-token");
      expect(mockSendResetCode).toHaveBeenCalledWith(mockEmail, "123456");
    });

    it("should throw if user not found", async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(null);
      await expect(geraTokenRecuperacaoSenha(mockEmail)).rejects.toThrow("Usuário não encontrado");
    });
  });

  // ✅ comparaCodigo
  describe("comparaCodigo", () => {
    const payload: ResetCodePayload = {
      userId: "user-id",
      code: "123456",
      exp: Math.floor(Date.now() / 1000) + 60,
      iat: Math.floor(Date.now() / 1000),
    };

    it("should throw if code expired", async () => {
      const expiredPayload = { ...payload, exp: Math.floor(Date.now() / 1000) - 60 };
      await expect(comparaCodigo("123456", expiredPayload)).rejects.toThrow("Código expirado");
    });

    it("should throw if code incorrect", async () => {
      await expect(comparaCodigo("wrong", payload)).rejects.toThrow("O código digitado está incorreto");
    });

    it("should pass if code correct", async () => {
      await expect(comparaCodigo("123456", payload)).resolves.not.toThrow();
    });
  });

  // ✅ resetarSenha
  describe("resetarSenha", () => {
    const payload: ResetCodePayload = {
      userId: "user-id",
      code: "123456",
      exp: Math.floor(Date.now() / 1000) + 60,
      iat: Math.floor(Date.now() / 1000),
    };
    const mockUser = { id: "user-id", senha: "old-hash" };

    it("should throw if token expired", async () => {
      const expiredPayload = { ...payload, exp: Math.floor(Date.now() / 1000) - 60 };
      await expect(resetarSenha({ novaSenha: "newPass", confirmarSenha: "newPass" }, expiredPayload)).rejects.toThrow("Código expirado");
    });

    it("should throw if user not found", async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(null);
      await expect(resetarSenha({ novaSenha: "newPass", confirmarSenha: "newPass" }, payload)).rejects.toThrow("Usuário não encontrado");
    });

    it("should reset password successfully", async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(mockUser);
      mockHashPassword.mockResolvedValue("new-hash");
      mockPrisma.usuario.update.mockResolvedValue({ ...mockUser, senha: "new-hash" });

      const result = await resetarSenha({ novaSenha: "newPass", confirmarSenha: "newPass" }, payload);
      expect(result.mensagem).toBe("Senha resetada com sucesso");
      expect(mockPrisma.usuario.update).toHaveBeenCalled();
    });
  });

  // ✅ alterarSenha
  describe("alterarSenha", () => {
    const mockUser = { id: "user-id", senha: "old-hash" };

    it("should throw if user not found", async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(null);
      await expect(alterarSenha("user-id", { senhaAtual: "old", novaSenha: "new", confirmarSenha: "new" })).rejects.toThrow("Usuário não encontrado");
    });

    it("should throw if current password incorrect", async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(mockUser);
      mockComparePassword.mockResolvedValue(false);
      await expect(alterarSenha("user-id", { senhaAtual: "wrong", novaSenha: "new", confirmarSenha: "new" })).rejects.toThrow("Senha atual incorreta");
    });

    it("should change password successfully", async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(mockUser);
      mockComparePassword.mockResolvedValue(true);
      mockHashPassword.mockResolvedValue("new-hash");
      mockPrisma.usuario.update.mockResolvedValue({ ...mockUser, senha: "new-hash" });

      const result = await alterarSenha("user-id", { senhaAtual: "old", novaSenha: "new", confirmarSenha: "new" });
      expect(result.mensagem).toBe("Senha alterada com sucesso");
      expect(mockPrisma.usuario.update).toHaveBeenCalled();
    });
  });
});