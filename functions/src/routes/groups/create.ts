import {
  NextFunction, Response, Router,
} from 'express';
import { body, validationResult } from 'express-validator';

import { TypedRequest } from '_models';
import { refs, firestore } from '_firebase';
import responses from '_responses';

interface Params {
  name: string;
  password?: string;
  latitude: number;
  longitude: number;
}

const router = Router();

const inputValidator = [
  body('name').isString().isLength({ min: 1 }),
  body('latitude').isNumeric(),
  body('longitude').isNumeric(),
  body('password').optional(),
];

router.post('/', inputValidator, (req: TypedRequest<Params>, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return responses.badRequest(req, res);
  }
  return next();
});

router.post('/', async (req: TypedRequest<Params>, res) => {
  try {
    const {
      name, password, latitude, longitude,
    } = req.body;

    const group = await refs.groups.add({
      name,
      password: password || null,
      coordinates: new firestore.GeoPoint(latitude, longitude),
    });

    responses.ok(`Created group with id ${group.id}`, res);
  } catch (err) {
    responses.unexpectedError(err, res);
  }
});

export default router;
