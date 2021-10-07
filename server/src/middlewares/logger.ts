import { Response, Request, NextFunction } from 'express';
import logSchema from '../models/mongoLogger';

const logger = async (req: Request, _res: Response, next: NextFunction) => {
  const log = new logSchema({
    method: req.method,
    request: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
  });

  try {
    await log.save();
  } catch (err) {
    console.log(err);
  }

  console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
  next();
};

export { logger };
