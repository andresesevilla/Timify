import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';
import AnxietyShieldCollection from './collection';

const router = express.Router();

/**
 * Get Anxiety Shield of a user.
 *
 * @name GET /api/anxietyshield
 *
 * @return {FreetResponse[]} - An array of Anxiety Shields created by user with id, ownerId
 * @throws {400} - If followerId is not given
 * @throws {404} - If no user has given followerId
 *
 */
router.get(
    '/',
    [
        userValidator.isUserLoggedIn,
    ],
    async (req: Request, res: Response) => {
        const user = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        const result = await AnxietyShieldCollection.findAnxietyShieldByOwner(user);
        res.status(200).json({
            anxietyShield: util.constructAnxietyShieldResponse(result)
        });
    }
);

/**
 * Update Anxiety Shield of a user.
 *
 * @name PATCH /api/anxietyshield
 *
 * @throws {400} - If followerId is not given
 * @throws {404} - If no user has given followerId
 *
 */
router.patch(
    '/',
    [
        userValidator.isUserLoggedIn,
        freetValidator.isValidAnxietyReport
    ],
    async (req: Request, res: Response) => {
        const user = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        const topic = req.body.topic;
        const result = await AnxietyShieldCollection.updateAnxietyShield(user, topic)
        res.status(200).json({
          message: `Successfully updated your Anxiety Shield.`,
          anxietyShield: util.constructAnxietyShieldResponse(result)
        });
    }
);

export { router as anxietyShieldRouter };
