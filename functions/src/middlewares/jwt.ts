import { NextFunction, Request, Response } from 'express';
import { admin } from '_firebase';
import { JWTPayload } from '_models';
import responses from '_responses';

declare global {

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      jwt: JWTPayload;
    }
  }
}

const verifyJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.headers.authorization) {
    responses.unauthorized(res);
    return;
  }
  const authHeader = req.headers.authorization.split(' ');
  if (authHeader.length !== 2) {
    responses.unauthorized(res);
    return;
  }
  const token = authHeader[1];

  // Verify JWT
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.jwt = decodedToken as JWTPayload;
    next();
  } catch (err) {
    responses.unauthorized(res);
  }
};

export default verifyJWT;
