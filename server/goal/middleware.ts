import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import GoalCollection from '../goal/collection';
import UserCollection from '../user/collection';
import { FriendCollection } from '../friend/collection';

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
  const { hours } = req.body as { hours: number };
  if (!hours) {
    res.status(400).json({
      error: 'Hours must be a valid number.'
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

const isViewAllowed = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId as string;
  const friendUsername = req.query.author as string;
  if (!friendUsername) {
    return res.status(400).json({
      error: 'Username not provided.'
    });
  }

  const friend = await UserCollection.findOneByUsername(friendUsername)
  const friendship = await FriendCollection.findOneFriend(userId, friend._id);
  
  if (!friendship && friend.id !== userId) {
    return res.status(403).json({
      error: `You are not friends with ${friendUsername}. Only friends can view this resource.`
    });
  }

  next();
};

export {
  isValidGoalContent as isValidGoalContent,
  isGoalExists,
  isValidGoalModifier,
  isViewAllowed
};
