import { Router } from "express";
import {
  esqueceuSenha,
  login,
  verificaCodigoRecuperacao,
  resetPassword,
  changePassword,
} from "./auth.controller";
import { validateBody } from "../../middlewares/validate.middleware";
import {
  resetPasswordSchema,
  changePasswordSchema,
} from "../../schemas/auth.schema";
import { authenticateToken } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/login", (req, res) => {
  login(req, res);
});

router.post("/esqueceu-senha", (req, res) => {
  esqueceuSenha(req, res);
});

router.post("/verifica-reset-code", (req, res) => {
  verificaCodigoRecuperacao(req, res);
});

// Rota para resetar senha (após esqueceu senha) - usuário NÃO logado
router.post("/resetar-senha", (req, res) => {
  validateBody(resetPasswordSchema)(req, res, () => {
    resetPassword(req, res);
  });
});

// Rota para alterar senha (usuário logado)
router.put("/alterar-senha", (req, res) => {
  authenticateToken(req, res, () => {
    validateBody(changePasswordSchema)(req, res, () => {
      changePassword(req, res);
    });
  });
});

export default router;
