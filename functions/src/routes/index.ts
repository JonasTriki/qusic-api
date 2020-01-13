import { Router } from 'express';
import groups from './groups';
import queues from './queues';

const router = Router();

router.use('/groups', groups);
router.use('/queues', queues);

export default router;
