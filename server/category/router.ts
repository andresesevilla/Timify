import type {Request, Response} from 'express';
import express from 'express';
import CategoryCollection from './collection';
import * as categoryValidator from './middleware';
import * as userValidator from '../user/middleware';
import {constructCategoryResponse} from './util';

const router = express.Router();

router.get(
  '/',
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    if (!userId) {
      return res.status(401).json({message: 'Unauthorized'});
    }

    const category = await CategoryCollection.findOneByUserId(userId);
    res.status(200).json(constructCategoryResponse(category));
  }
);

router.put(
  '/',
  [
    userValidator.isUserLoggedIn,
    categoryValidator.isValidEntries
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    await CategoryCollection.updateOneByUserId(userId, req.body);
    res.status(200).json({
      message: 'Categories successfully updated'
    });
  }
);

export {router as categoryRouter};
