import { NextFunction, Response, Request } from 'express';
import { validationResult } from 'express-validator';
import responses from '_responses';

export const validateInput = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return responses.badRequest(req, res);
  }
  return next();
};
