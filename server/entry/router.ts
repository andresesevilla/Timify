import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import EntryCollection from './collection';
import * as userValidator from '../user/middleware';
import * as friendValidator from '../friend/middleware';
import * as entryValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all by logged in user
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
    entryValidator.isValidEntryQuery
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
  
    const categoryName = req.query.category as string;
    const start = new Date(req.query.startTime as string);
    const end = new Date(req.query.endTime as string);

    const allEntries = await EntryCollection.findAll(userId, categoryName, start, end);
    const response = allEntries.map(util.constructEntryResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new entry.
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    entryValidator.isValidEntryContent,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn

    const entry = await EntryCollection.addOne(userId, req.body.category, req.body.start, req.body.end, req.body.tag);
    
    res.status(201).json({
      message: 'Your entry was created successfully.',
      entry: util.constructEntryResponse(entry)
    });
  }
);

/**
 * Delete a entry
 */
router.delete(
  '/:entryId?',
  [
    userValidator.isUserLoggedIn,
    entryValidator.isEntryExists,
    entryValidator.isValidEntryModifier
  ],
  async (req: Request, res: Response) => {
    await EntryCollection.deleteOne(req.params.entryId);
    res.status(200).json({
      message: 'Your entry was deleted successfully.'
    });
  }
);

export { router as entryRouter };
