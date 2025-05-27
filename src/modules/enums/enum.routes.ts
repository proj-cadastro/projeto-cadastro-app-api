import { Router } from 'express';
import { 
    getTitulacao,
    getStatusAtividade,
    getModeloCurso,
    getReferencia,
    getTurno,
    getTipoMateria
} from './enum.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/titulacao', (req, res) => {
    authenticateToken(req, res, () => { getTitulacao(req, res) });
});

router.get('/statusAtividade', (req, res) => {
    authenticateToken(req, res, () => { getStatusAtividade(req, res) });
});

router.get('/modeloCurso', (req, res) => {
    authenticateToken(req, res, () => { getModeloCurso(req, res) });
});

router.get('/referencia', (req, res) => {
    authenticateToken(req, res, () => { getReferencia(req, res) });
});

router.get('/turno', (req, res) => {
    authenticateToken(req, res, () => { getTurno(req, res) });
});

router.get('/tipoMateria', (req, res) => {
    authenticateToken(req, res, () => { getTipoMateria(req, res) });
});


export default router;