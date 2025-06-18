import { Router } from 'express';
import { unidadeProximaController } from './unidade.controller';

const router = Router();

router.post('/', (req, res) => {
    unidadeProximaController(req, res);
});


export default router;
