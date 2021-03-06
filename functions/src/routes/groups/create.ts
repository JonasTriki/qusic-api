import { Router } from 'express';
import { body } from 'express-validator';
import * as argon2 from 'argon2';

import { TypedRequest } from '_models';
import { refs, firestore } from '_firebase';
import responses from '_responses';
import { validateInput } from '_middlewares';

interface Params {
  name: string;
  password?: string;
  latitude: number;
  longitude: number;
}

interface ResponseData {
  groupId: string;
}

const router = Router();

const validationChain = [
  body('name').isString().isLength({ min: 1 }),
  body('latitude').isNumeric(),
  body('longitude').isNumeric(),
  body('password').optional(),
];

router.post('/', validationChain, validateInput);

router.post('/', async (req: TypedRequest<Params>, res) => {
  try {
    const {
      name, password, latitude, longitude,
    } = req.body;
    const { uid } = req.jwt;

    let hash = null;
    if (password) {
      hash = await argon2.hash(password);
    }

    const group = await refs.groups.add({
      name,
      hostUserId: uid,
      devices: [uid],
      password: hash,
      coordinates: new firestore.GeoPoint(latitude, longitude),
    });

    responses.ok<ResponseData>({ groupId: group.id }, res);
  } catch (err) {
    responses.unexpectedError(err, res);
  }
});

export default router;
