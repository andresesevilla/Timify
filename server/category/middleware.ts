import type {Request, Response, NextFunction} from 'express';

const isValidEntries = (req: Request, res: Response, next: NextFunction) => {
  // TODO
  next();
};

export {
  isValidEntries
};
