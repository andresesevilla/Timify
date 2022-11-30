import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import EntryCollection from './collection';
import UserCollection from '../user/collection';
import CategoryCollection from '../category/collection';
import { FriendCollection } from '../friend/collection';

/**
 * Checks if a entry with entryId is req.params exists
 */
const isEntryExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.entryId);
  const entry = validFormat ? await EntryCollection.findOneById(req.params.entryId) : '';
  if (!entry) {
    res.status(404).json({
      error: `Entry with entry ID ${req.params.entryId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the entry in req.body is valid, i.e not a stream of empty
 * spaces and not more than 70 characters
 */
const isValidEntryContent = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.session.userId as string) ?? '';

  const categoryName = req.body.category as string;
  const category = await CategoryCollection.findByNameAndUserId(userId, categoryName);
  if (!category) {
    res.status(404).json({
      error: 'Must provide a valid category.'
    });
    return;
  }

  const startString = req.body.start as string;
  const start = new Date(startString);
  if (isNaN(start.getTime())) {
    res.status(400).json({
      error: 'Must provide valid start time.'
    });
    return;
  }

  const endString = req.body.end as string;
  const end = new Date(endString);
  if (isNaN(end.getTime())) {
    res.status(400).json({
      error: 'Must provide valid end time.'
    });
    return;
  }

  if (end.getTime() - start.getTime() <= 0) {
    res.status(400).json({
      error: 'Must be a valid positive length time period'
    });
    return;
  }


  next();
};

/**
 * Checks if the current user is the author of the entry whose entryId is in req.params
 */
const isValidEntryModifier = async (req: Request, res: Response, next: NextFunction) => {
  const entry = await EntryCollection.findOneById(req.params.entryId);
  const userId = entry.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' entries.'
    });
    return;
  }

  next();
};

export {
  isValidEntryContent,
  isEntryExists,
  isValidEntryModifier,
};
