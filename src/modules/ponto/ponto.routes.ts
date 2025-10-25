import { Router } from "express";
import {
  registrarEntrada,
  registrarSaida,
  create,
  getAll,
  getById,
  update,
  remove,
  getByUsuarioId,
  getPontoAberto,
  getMeusPontos,
  getMeuPontoAberto,
} from "./ponto.controller";
import { validateBody } from "../../middlewares/validate.middleware";
import {
  createPontoSchema,
  updatePontoSchema,
} from "../../schemas/ponto.schema";
import {
  authenticateToken,
  requireAdminOrSuperAdmin,
} from "../../middlewares/auth.middleware";

const router = Router();

// Registrar entrada (qualquer usuário autenticado pode registrar sua própria entrada)
router.post("/entrada", (req, res) => {
  authenticateToken(req, res, () => {
    registrarEntrada(req, res);
  });
});

// Registrar saída (qualquer usuário autenticado pode registrar sua própria saída)
router.put("/saida/:pontoId", (req, res) => {
  authenticateToken(req, res, () => {
    registrarSaida(req, res);
  });
});

// Apenas admins podem fazer CRUD completo de pontos
router.post("/", (req, res) => {
  authenticateToken(req, res, () => {
    authenticateToken(req, res, () => {
      validateBody(createPontoSchema)(req, res, () => {
        create(req, res);
      });
    });
  });
});

// Apenas admins podem listar todos os pontos
router.get("/", (req, res) => {
  authenticateToken(req, res, () => {
    getAll(req, res);
  });
});

// Rotas para o próprio usuário (qualquer usuário autenticado) - DEVEM VIR ANTES DAS ROTAS COM :id
router.get("/meus-pontos", (req, res) => {
  authenticateToken(req, res, () => {
    getMeusPontos(req, res);
  });
});

router.get("/meu-ponto-aberto", (req, res) => {
  authenticateToken(req, res, () => {
    getMeuPontoAberto(req, res);
  });
});

// Admins podem buscar pontos de qualquer usuário
router.get("/usuario/:usuarioId", (req, res) => {
  authenticateToken(req, res, () => {
    requireAdminOrSuperAdmin(req, res, () => {
      getByUsuarioId(req, res);
    });
  });
});

// Admins podem buscar ponto aberto de qualquer usuário
router.get("/usuario/:usuarioId/aberto", (req, res) => {
  authenticateToken(req, res, () => {
    getPontoAberto(req, res);
  });
});

// Apenas admins podem ver detalhes de qualquer ponto - DEVE VIR DEPOIS DAS ROTAS ESPECÍFICAS
router.get("/:id", (req, res) => {
  authenticateToken(req, res, () => {
    getById(req, res);
  });
});

// Apenas admins podem atualizar pontos
router.put("/:id", (req, res) => {
  authenticateToken(req, res, () => {
    validateBody(updatePontoSchema)(req, res, () => {
      update(req, res);
    });
  });
});

// Apenas admins podem deletar pontos
router.delete("/:id", (req, res) => {
  authenticateToken(req, res, () => {
    requireAdminOrSuperAdmin(req, res, () => {
      remove(req, res);
    });
  });
});

export default router;
