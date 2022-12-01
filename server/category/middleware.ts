import type { Request, Response, NextFunction } from 'express';
import CategoryCollection from './collection';

const isValidCategoryName = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body as { name: string };
  if (!name || !name.trim()) {
    res.status(400).json({
      error: 'Category name must be at least one character long.'
    });
    return;
  }

  const userId = (req.session.userId as string) ?? '';

  const category = await CategoryCollection.findByNameAndUserId(userId, name);
  if (category) {
    res.status(409).json({
      error: 'You already have a category with this name.'
    });
    return;
  }

  next();
};

const isCategoryExists = async (req: Request, res: Response, next: NextFunction) => {
  const name = req.params.categoryName;
  const userId = (req.session.userId as string) ?? '';
  const category = await CategoryCollection.findByNameAndUserId(userId, name);
  if (!category) {
    res.status(404).json({
      error: 'Given category name does not exist.'
    });
    return;
  }

  next();
};

export {
  isValidCategoryName,
  isCategoryExists
};
