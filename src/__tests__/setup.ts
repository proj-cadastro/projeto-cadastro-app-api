// Mock do Prisma Client
jest.mock("../prisma/client", () => ({
  __esModule: true,
  default: {
    $transaction: jest.fn(),
    usuario: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    curso: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    materia: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    cursoMateria: {
      deleteMany: jest.fn(),
    },
    professor: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      createMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    monitor: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    ponto: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    unidade: {
      findMany: jest.fn(),
    },
  },
}));

// Mock das funções utilitárias
// Note: hash e jwt não são mockados aqui para permitir testes de integração
// Eles serão mockados individualmente nos testes que precisarem

// jest.mock("../utils/hash", () => ({
//   hashPassword: jest.fn(),
//   comparePassword: jest.fn(),
// }));

// jest.mock("../utils/jwt", () => ({
//   generateToken: jest.fn(),
//   verifyToken: jest.fn(),
// }));

jest.mock("../utils/nodemailer", () => ({
  sendEmail: jest.fn(),
}));

jest.mock("../utils/reset-code", () => ({
  generateResetCode: jest.fn(),
  sendResetCode: jest.fn(),
}));

// Configuração global para os testes
beforeEach(() => {
  jest.clearAllMocks();
});
