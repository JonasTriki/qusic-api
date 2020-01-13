import { Router } from 'express';
import add from './add';

const router = Router();

router.use('/add', add);

export default router;
