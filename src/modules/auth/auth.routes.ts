import { Router } from 'express';
import { login } from './auth.controller';

const router = Router();

router.post('/login', (req, res) => {
    login(req, res);
});

export default router;
