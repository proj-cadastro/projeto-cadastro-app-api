import { Router } from 'express';
import { esqueceuSenha, login, verificaCodigoRecuperacao } from './auth.controller';

const router = Router();

router.post('/login', (req, res) => {
    login(req, res);
});

router.post('/esqueceu-senha', (req, res) => {
    esqueceuSenha(req, res)
})

router.post('/verifica-reset-code', (req, res) => {
    verificaCodigoRecuperacao(req, res)
})

export default router;
