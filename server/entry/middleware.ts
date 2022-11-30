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
  // const { hours } = req.body as { hours: number };
  // if (!hours) {
  //   res.status(400).json({
  //     error: 'Hours must be a valid number.'
  //   });
  //   return;
  // }
  // const type = req.body.type;
  // if (type !== 'entry' && type !== 'budget') {
  //   res.status(400).json({
  //     error: 'Entry type is invalid.'
  //   });
  //   return;
  // }

  // const userId = (req.session.userId as string) ?? '';
  // const category = await CategoryCollection.findByNameAndUserId(userId, req.body.category);
  // if (!category) {
  //   res.status(404).json({
  //     error: 'Given category does not exist.'
  //   });
  //   return;
  // }

  // const entry = await EntryCollection.findOneByCategoryId(category.id);
  // if (entry) {
  //   res.status(409).json({
  //     error: 'This category already has a entry.'
  //   });
  //   return;
  // }

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
