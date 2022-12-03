import type {Request, Response} from 'express';
import express from 'express';
import CategoryCollection from './collection';
import * as categoryValidator from './middleware';
import * as userValidator from '../user/middleware';
import {constructCategoryResponse} from './util';

const router = express.Router();

router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const categories = await CategoryCollection.findAllByUserId(userId);
    res.status(200).json(categories.map(constructCategoryResponse));
  }
);

router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    categoryValidator.isValidCategoryName
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const newCategory = await CategoryCollection.addOne(userId, req.body.name);

    res.status(201).json({
      message: 'Your category was created successfully.',
      category: constructCategoryResponse(newCategory)
    });
  }
);

router.delete(
  '/:categoryName?',
  [
    userValidator.isUserLoggedIn,
    categoryValidator.isCategoryExists
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    await CategoryCollection.deleteOne(userId, req.params.categoryName);
    res.status(200).json({
      message: 'Your category was deleted successfully.'
    });
  }
);

router.patch(
  '/:categoryName?',
  [
    userValidator.isUserLoggedIn,
    categoryValidator.isValidCategoryName,
    categoryValidator.isCategoryExists
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const updatedCategory = await CategoryCollection.renameOne(userId, req.params.categoryName, req.body.name);

    res.status(200).json({
      message: 'Your category was updated successfully.',
      category: constructCategoryResponse(updatedCategory)
    });
  }
);

export {router as categoryRouter};
