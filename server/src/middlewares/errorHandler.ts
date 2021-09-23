import { Response, Request, NextFunction } from 'express';

const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction): void => {
  console.log(`Error: ${err.message}`);
  res.status(500).send(`${err.message}`);
  next(err);
}

export { errorHandler };