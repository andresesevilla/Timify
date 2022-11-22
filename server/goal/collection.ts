import type { HydratedDocument, Types } from 'mongoose';
import type { Goal } from './model';
import GoalModel from './model';
import UserCollection from '../user/collection';
import FollowCollection from '../follow/collection';
import {FriendCollection, FriendRequestCollection} from '../friend/collection';
import type { PopulatedFollow } from '../follow/model';

/**
 * This files contains a class that has the functionality to explore goals
 * stored in MongoDB, including adding, finding, updating, and deleting goals.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Goal> is the output of the GoalModel() constructor,
 * and contains all the information in Goal. https://mongoosejs.com/docs/typescript.html
 */
class GoalCollection {
  /**
   * Add a goal to the collection
   *
   * @param {string} authorId - The id of the author of the goal
   * @param {string} content - The id of the content of the goal
   * @return {Promise<HydratedDocument<Goal>>} - The newly created goal
   */
  static async addOne(authorId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Goal>> {
    const date = new Date();
    const goal = new GoalModel({
      authorId,
      dateCreated: date,
      content,
    });
    await goal.save(); // Saves goal to MongoDB
    return goal.populate('authorId');
  }

  /**
   * Find a goal by goalId
   *
   * @param {string} goalId - The id of the goal to find
   * @return {Promise<HydratedDocument<Goal>> | Promise<null> } - The goal with the given goalId, if any
   */
  static async findOne(goalId: Types.ObjectId | string): Promise<HydratedDocument<Goal>> {
    return GoalModel.findOne({ _id: goalId }).populate('authorId');
  }

  /**
   * Get all the goals in the database
   *
   * @return {Promise<HydratedDocument<Goal>[]>} - An array of all of the goals
   */
  static async findAll(userId: string): Promise<Array<HydratedDocument<Goal>>> {
    // Retrieves goals and sorts them from most to least recent
    const allGoals = await GoalModel.find({}).sort({ dateCreated: -1 }).populate('authorId');
    return allGoals;
  }

  /**
   * Get all the goals in by given author
   *
   * @param {string} username - The username of author of the goals
   * @return {Promise<HydratedDocument<Goal>[]>} - An array of all of the goals
   */
  static async findAllByUsername(userId: string, username: string): Promise<Array<HydratedDocument<Goal>>> {
    const author = await UserCollection.findOneByUsername(username);
    const goals = await GoalModel.find({ authorId: author._id }).sort({ dateCreated: -1 }).populate('authorId');
    return goals;
  }

  /**
   * Get all goals written by an author followed by user
   *
   * @param {string} userId - The username of the user
   * @return {Promise<HydratedDocument<Goal>[]>} - An array of all of the goals made by followed users
   */
  static async findAllInFeed(userId: string): Promise<Array<HydratedDocument<Goal>>> {
    // Get all of the users that this user is friends with
    const friendsUsernames = await FriendCollection.findAllFriendUsernames(userId);

    const friendIds = await Promise.all(friendsUsernames.map(async username => {
      const friend = await UserCollection.findOneByUsername(username.toString());
      return { authorId: friend.id };
    }));

    if (friendIds.length === 0) {
      return [];
    }

    const goals = await GoalModel.find({ $or: friendIds }).sort({ dateCreated: -1 }).populate('authorId');
    return goals;
  }

  /**
   * Delete a goal with given goalId.
   *
   * @param {string} goalId - The goalId of goal to delete
   * @return {Promise<Boolean>} - true if the goal has been deleted, false otherwise
   */
  static async deleteOne(goalId: Types.ObjectId | string): Promise<boolean> {
    const goal = await GoalModel.deleteOne({ _id: goalId });
    return goal !== null;
  }
}

export default GoalCollection;
