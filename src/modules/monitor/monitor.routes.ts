import { Router } from "express";
import {
  create,
  getAll,
  getById,
  update,
  remove,
  getByProfessorId,
} from "./monitor.controller";
import { validateBody } from "../../middlewares/validate.middleware";
import {
  createMonitorSchema,
  updateMonitorSchema,
} from "../../schemas/monitor.schema";
import {
  authenticateToken,
  requireSuperAdmin,
  requireAdminOrSuperAdmin,
} from "../../middlewares/auth.middleware";

const router = Router();

// Apenas super admin pode criar monitores
router.post("/", (req, res) => {
  authenticateToken(req, res, () => {
    requireSuperAdmin(req, res, () => {
      validateBody(createMonitorSchema)(req, res, () => {
        create(req, res);
      });
    });
  });
});

// Admin e super admin podem listar monitores
router.get("/", (req, res) => {
  authenticateToken(req, res, () => {
    requireAdminOrSuperAdmin(req, res, () => {
      getAll(req, res);
    });
  });
});

// Admin e super admin podem ver detalhes de um monitor
router.get("/:id", (req, res) => {
  authenticateToken(req, res, () => {
    requireAdminOrSuperAdmin(req, res, () => {
      getById(req, res);
    });
  });
});

// Apenas super admin pode atualizar monitores
router.put("/:id", (req, res) => {
  authenticateToken(req, res, () => {
    requireSuperAdmin(req, res, () => {
      validateBody(updateMonitorSchema)(req, res, () => {
        update(req, res);
      });
    });
  });
});

// Apenas super admin pode deletar monitores
router.delete("/:id", (req, res) => {
  authenticateToken(req, res, () => {
    requireSuperAdmin(req, res, () => {
      remove(req, res);
    });
  });
});

// Admin e super admin podem ver monitores por professor
router.get("/professor/:professorId", (req, res) => {
  authenticateToken(req, res, () => {
    requireAdminOrSuperAdmin(req, res, () => {
      getByProfessorId(req, res);
    });
  });
});

export default router;
