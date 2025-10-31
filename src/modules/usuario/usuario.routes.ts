import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove,
  toggleStatus,
  createMonitorUser,
} from "./usuario.controller";
import { validateBody } from "../../middlewares/validate.middleware";
import {
  createUsuarioSchema,
  updateUsuarioSchema,
} from "../../schemas/usuario.schema";
import {
  authenticateToken,
  requireSuperAdmin,
  requireAdminOrSuperAdmin,
} from "../../middlewares/auth.middleware";

const router = Router();

// Criação de usuário público (sem autenticação) - será ADMIN por padrão
router.post("/", (req, res) => {
  validateBody(createUsuarioSchema)(req, res, () => {
    create(req, res);
  });
});

// Apenas super admin pode criar usuário monitor
router.post("/monitor", (req, res) => {
  authenticateToken(req, res, () => {
    requireSuperAdmin(req, res, () => {
      validateBody(createUsuarioSchema)(req, res, () => {
        createMonitorUser(req, res);
      });
    });
  });
});

// Admin e super admin podem listar usuários
router.get("/", (req, res) => {
  authenticateToken(req, res, () => {
    requireAdminOrSuperAdmin(req, res, () => {
      getAll(req, res);
    });
  });
});

// Admin e super admin podem ver detalhes de um usuário
router.get("/:id", (req, res) => {
  authenticateToken(req, res, () => {
      getById(req, res);
    });
  });

// Admin e super admin podem atualizar usuários
router.put("/:id", (req, res) => {
  authenticateToken(req, res, () => {
    requireAdminOrSuperAdmin(req, res, () => {
      validateBody(updateUsuarioSchema)(req, res, () => {
        update(req, res);
      });
    });
  });
});

// Apenas super admin pode deletar usuários
router.delete("/:id", (req, res) => {
  authenticateToken(req, res, () => {
    requireSuperAdmin(req, res, () => {
      remove(req, res);
    });
  });
});

// Apenas super admin pode ativar/desativar usuários
router.patch("/:id/toggle-status", (req, res) => {
  authenticateToken(req, res, () => {
    requireSuperAdmin(req, res, () => {
      toggleStatus(req, res);
    });
  });
});

export default router;
