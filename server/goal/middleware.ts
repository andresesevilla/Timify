import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import GoalCollection from '../goal/collection';

/**
 * Checks if a goal with goalId is req.params exists
 */
const isGoalExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.goalId);
  const goal = validFormat ? await GoalCollection.findOne(req.params.goalId) : '';
  if (!goal) {
    res.status(404).json({
      error: `Goal with goal ID ${req.params.goalId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the goal in req.body is valid, i.e not a stream of empty
 * spaces and not more than 70 characters
 */
const isValidGoalContent = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body as { name: string };
  const { hours } = req.body as { hours: number };
  if (!name.trim()) {
    res.status(400).json({
      error: 'Goal name must be at least one character long.'
    });
    return;
  }
  if (!hours) {
    res.status(400).json({
      error: 'Hours must be a valid number.'
    });
    return;
  }
  if (name.length > 70) {
    res.status(413).json({
      error: 'Goal name must be no more than 70 characters.'
    });
    return;
  }
  const type = req.body.type;
  if (type !== 'goal' && type !== 'budget') {
    res.status(400).json({
      error: 'Goal type is invalid.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the goal whose goalId is in req.params
 */
const isValidGoalModifier = async (req: Request, res: Response, next: NextFunction) => {
  const goal = await GoalCollection.findOne(req.params.goalId);
  const userId = goal.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' goals.'
    });
    return;
  }

  next();
};

export {
  isValidGoalContent as isValidGoalContent,
  isGoalExists,
  isValidGoalModifier
};
