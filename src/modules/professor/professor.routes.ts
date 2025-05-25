import { Router } from 'express';
import { create, getAll, getById, update, remove } from './professor.controller';
import { validateBody } from '../../middlewares/validate.middleware';
import { createProfessorSchema, updateProfessorSchema } from '../../schemas/professor.schema';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', (req, res) => {
    authenticateToken(req, res, () => { validateBody(createProfessorSchema)(req, res, () => { create(req, res) }) });
});

router.get('/', (req, res) => {
    authenticateToken(req, res, () => { getAll(req, res) });
});

router.get('/:id', (req, res) => {
    authenticateToken(req, res, () => { getById(req, res) });
});

router.put('/:id', (req, res) => {
    authenticateToken(req, res, () => { validateBody(updateProfessorSchema)(req, res, () => { update(req, res) }) });
});

router.delete('/:id', (req, res) => {
    authenticateToken(req, res, () => { remove(req, res) });
});

export default router;
