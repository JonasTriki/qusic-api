import { Router } from 'express';
import { verifyJWT } from '_middlewares';

import create from './create';
import join from './join';
import leave from './leave';
import kick from './kick';
import edit from './edit';

const router = Router();

router.use(verifyJWT);
router.use('/create', create);
router.use('/join', join);
router.use('/leave', leave);
router.use('/kick', kick);
router.use('/edit', edit);

export default router;
