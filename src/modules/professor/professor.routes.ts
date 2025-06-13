import { Router } from 'express';
import { create, getAll, getById, update, remove, downloadFile, uploadFile, transferirCoordenacao, hasCursoCoordenado } from './professor.controller';
import { validateBody } from '../../middlewares/validate.middleware';
import { createProfessorSchema, updateProfessorSchema } from '../../schemas/professor.schema';
import { authenticateToken } from '../../middlewares/auth.middleware';

import multer from 'multer'

const router = Router();

router.post('/', (req, res) => {
    authenticateToken(req, res, () => { validateBody(createProfessorSchema)(req, res, () => { create(req, res) }) });
});

const upload = multer({ storage: multer.memoryStorage() })
router.post('/upload/planilha-modelo.xlsx', upload.single('file'), (req, res) => {
    authenticateToken(req, res, () => { uploadFile(req, res) })
})

router.get('/download/planilha-modelo.xlsx', (req, res) => {
    authenticateToken(req, res, () => { downloadFile(req, res) })
})

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

router.put('/:id/transferir-coordenacao', (req, res) => {
    authenticateToken(req, res, () => { transferirCoordenacao(req, res) });
});

router.get('/:id/tem-curso-coordenado', (req, res) => {
    authenticateToken(req, res, () => { hasCursoCoordenado(req, res) });
});

export default router;
