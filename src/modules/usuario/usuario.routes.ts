import { Router } from 'express';
import { getAll, getById, create, update, remove } from './usuario.controller';
import { validateBody } from '../../middlewares/validate.middleware';
import { createUsuarioSchema, updateUsuarioSchema } from '../../schemas/usuario.schema';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', (req, res) => {
    validateBody(createUsuarioSchema)(req, res, () => { create(req, res) });
});

router.get('/', (req, res) => {
    authenticateToken(req, res, () => { getAll(req, res) });
});

router.get('/:id', (req, res) => {
    authenticateToken(req, res, () => { getById(req, res) });
});

router.put('/:id', (req, res) => {
    authenticateToken(req, res, () => { validateBody(updateUsuarioSchema)(req, res, () => { update(req, res) }) });
});

router.delete('/:id', (req, res) => {
    authenticateToken(req, res, () => { remove(req, res) });
});

export default router;
