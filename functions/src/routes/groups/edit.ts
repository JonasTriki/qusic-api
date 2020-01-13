import { Router } from 'express';
import { body } from 'express-validator';
import * as argon2 from 'argon2';

import { TypedRequest, Group } from '_models';
import { refs } from '_firebase';
import responses from '_responses';
import { validateInput } from '_middlewares';

interface Params {
  groupId: string;
  name: string;
  password?: string;
}

const router = Router();

const validationChain = [
  body('groupId').isString().isLength({ min: 1 }),
  body('name').isString().isLength({ min: 1 }),
  body('password').optional(),
];

router.post('/', validationChain, validateInput);

router.post('/', async (req: TypedRequest<Params>, res) => {
  try {
    const {
      groupId, name, password,
    } = req.body;
    const { uid } = req.jwt;
    const groupRef = refs.groups.doc(groupId);
    const groupDoc = await groupRef.get();
    if (!groupDoc.exists) {
      responses.badRequest(req, res);
      return;
    }
    const group = groupDoc.data() as Group;
    if (group.hostUserId !== uid) {
      responses.badRequest(req, res);
      return;
    }

    let hash = null;
    if (password) {
      hash = await argon2.hash(password);
    }

    await refs.groups.doc(groupId).update({
      name,
      password: hash,
    });

    responses.ok('Group edited', res);
  } catch (err) {
    responses.unexpectedError(err, res);
  }
});

export default router;
