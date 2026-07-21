import { Router } from 'express';
import pkg from '../../package.json';

const router = Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    version: pkg.version,
    timestamp: new Date().toISOString(),
  });
});

export default router;
