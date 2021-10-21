import { Response, Request, NextFunction } from 'express';
import errorSchema from '../models/mongoError';

const errorHandler = async (err: Error, _req: Request, res: Response, next: NextFunction): Promise<void> => {

  const error = new errorSchema({
    error: `${err.message}`,
  });

  try {
    await error.save();
  } catch (err) {
    console.log(err);
  }

  console.log(`Error: ${err.message}`);
  res.status(500).send(`${err.message}`);
  next(err);
};

export { errorHandler };
