import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import EntryCollection from './collection';
import * as userValidator from '../user/middleware';
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
    entryValidator.isValidEntryContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn

    if (req.body.overwrite) {
      const newEntryStart = new Date(req.body.start);
      const newEntryEnd = new Date(req.body.end);


      const existingEntries = await EntryCollection.findAll(userId, undefined, undefined, undefined);
      for (const entry of existingEntries) {
        if (util.isConflict(entry.start, entry.end, newEntryStart, newEntryEnd)) {
          // Case 1: new entry completely contains old entry (must delete old entry)
          if (entry.start.getTime() - newEntryStart.getTime() >= 0 && newEntryEnd.getTime() - entry.end.getTime() >= 0) {
            EntryCollection.deleteOne(entry.id);
          }

          // Case 2: old entry completely contains new entry (must split old entry)
          else if (newEntryStart.getTime() - entry.start.getTime() >= 0 &&  entry.end.getTime() - newEntryEnd.getTime() >= 0) {
            // Create a new entry that starts at the new entry end, ends at the old entry end
            EntryCollection.addOneId(userId, entry.category, newEntryEnd, entry.end, entry.tag);
            
            // Update the old entry to end at the new entry start
            EntryCollection.updateOneTime(entry.id, entry.start, newEntryStart);
          }

          // Case 3: New entry clips start of old entry
          else if (entry.end.getTime() - newEntryEnd.getTime() >= 0 && newEntryEnd.getTime() - entry.start.getTime() >= 0) {
            EntryCollection.updateOneTime(entry.id, newEntryEnd, entry.end);
          }

          // Case 4: New entry clips end of old entry
          else if (newEntryEnd.getTime() - entry.end.getTime() >= 0 && entry.end.getTime() - newEntryStart.getTime() >= 0) {
            EntryCollection.updateOneTime(entry.id, entry.start, newEntryStart);
          }
        }
      }
    }

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

/**
 * Update an entry.
 */
router.put(
  '/:entryId?',
  [
    userValidator.isUserLoggedIn,
    entryValidator.isValidEntryEdit
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn

    const { entryId } = req.params;
    const entry = await EntryCollection.updateOne(userId, entryId, req.body.category, req.body.start, req.body.end, req.body.tag);
    res.status(201).json({
      message: 'Your entry was updated successfully.',
      entry: util.constructEntryResponse(entry)
    });
  }
);

export { router as entryRouter };
