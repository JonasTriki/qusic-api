import {
  NextFunction, Request, Response, Router,
} from 'express';
import { body, validationResult } from 'express-validator';
import responses from '_responses';

const router = Router();

const inputValidator = [
  body('name').isString().isLength({ min: 1 }),
  body('pin').isNumeric().optional(),
  body('latitude').isNumeric(),
  body('longitude').isNumeric(),
];

router.post('/', inputValidator, (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return responses.badRequest(req, res);
  }
  return next();
});

router.post('/', (req, res) => {
  try {
    const {
      name, pin, latitude, longitude,
    } = req.body;

    // TODO: Implement
    responses.ok({
      name, pin, latitude, longitude,
    }, res);
  } catch (err) {
    responses.unexpectedError(err, res);
  }
});

export default router;
