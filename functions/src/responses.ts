import { Request, Response } from 'express';
import logger from '_logger';

interface ErrorResponse {
  message: string;
}

const unexpectedError = (err: ErrorResponse, res: Response): void => {
  // TODO: Print to console if dev, else Firebase Event error if prod.
  logger.log({ level: 'error', message: err.message });
  res.status(500).send('Unexpected error occurred');
};

/*
const forbidden = (data: any, res: Response): void => {
  res.status(403).send({ message: 'forbidden', data });
};
*/

const unauthorized = (res: Response): void => {
  res.status(401).send('Unauthorized');
};

const badRequest = (req: Request, res: Response): void => {
  logger.log({ level: 'error', message: `Bad request body?: ${req.body}` });
  res.status(400).send('Bad request');
};

/*
const accepted = (data: any, sendMessage: string, res: Response): void => {
  res.status(202).send({ message: sendMessage, data });
};
*/

function message<T>(sendMessage: string, data: T, res: Response): void {
  res.send({ message: sendMessage, data });
}

function ok<T>(data: T, res: Response): void {
  message<T>('ok', data, res);
}

export default {
  unexpectedError,
  unauthorized,
  // forbidden,
  badRequest,
  // accepted,
  message,
  ok,
};
