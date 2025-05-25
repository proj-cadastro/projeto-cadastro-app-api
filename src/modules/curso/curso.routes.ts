import { Router } from 'express';
import { create, getAll, getById, update, remove } from './curso.controller';
import { validateBody } from '../../middlewares/validate.middleware';
import { createCursoSchema, updateCursoSchema } from '../../schemas/curso.schema';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', (req, res) => {
    authenticateToken(req, res, () => { validateBody(createCursoSchema)(req, res, () => { create(req, res) }) });
});

router.get('/', (req, res) => {
    authenticateToken(req, res, () => { getAll(req, res) });
});

router.get('/:id', (req, res) => {
    authenticateToken(req, res, () => { getById(req, res) });
});

router.put('/:id', (req, res) => {
    authenticateToken(req, res, () => { validateBody(updateCursoSchema)(req, res, () => { update(req, res) }) });
});

router.delete('/:id', (req, res) => {
    authenticateToken(req, res, () => { remove(req, res) });
});

export default router;
