import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import GoalCollection from './collection';
import * as userValidator from '../user/middleware';
import * as goalValidator from '../goal/middleware';
import * as util from './util';
import UserCollection from '../user/collection';

const router = express.Router();

/**
 * Get all the goals
 *
 * @name GET /api/goals
 *
 * @return {GoalResponse[]} - A list of all the goals sorted in descending
 *                      order by date modified
 */
/**
 * Get goals by author.
 *
 * @name GET /api/goals?authorId=username
 *
 * @return {GoalResponse[]} - An array of goals created by user with username, author
 * @throws {400} - If author is not given
 * @throws {404} - If no user has given author
 *
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if author query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.findOneByUserId(userId);
    // Check if feed query parameter was supplied
    if (req.query.feed !== undefined) {
      const feedGoals = await GoalCollection.findAllInFeed(userId);
      const response = feedGoals.map(util.constructGoalResponse);
      res.status(200).json(response);
    } else {
      const allGoals = await GoalCollection.findAll(userId);
      const response = allGoals.map(util.constructGoalResponse);
      res.status(200).json(response);
    }
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const authorGoals = await GoalCollection.findAllByUsername(userId, req.query.author as string);
    const response = authorGoals.map(util.constructGoalResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new goal.
 *
 * @name POST /api/goals
 *
 * @param {string} content - The content of the goal
 * @return {GoalResponse} - The created goal
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the goal content is empty or a stream of empty spaces
 * @throws {413} - If the goal content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    goalValidator.isValidGoalContent
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const goal = await GoalCollection.addOne(userId, req.body.content);
    res.status(201).json({
      message: 'Your goal was created successfully.',
      goal: util.constructGoalResponse(goal)
    });
  }
);

/**
 * Delete a goal
 *
 * @name DELETE /api/goals/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the goal
 * @throws {404} - If the goalId is not valid
 */
router.delete(
  '/:goalId?',
  [
    userValidator.isUserLoggedIn,
    goalValidator.isGoalExists,
    goalValidator.isValidGoalModifier
  ],
  async (req: Request, res: Response) => {
    await GoalCollection.deleteOne(req.params.goalId);
    res.status(200).json({
      message: 'Your goal was deleted successfully.'
    });
  }
);

export { router as goalRouter };