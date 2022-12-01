import type { HydratedDocument, Types } from 'mongoose';
import type { Goal } from './model';
import GoalModel from './model';
import UserCollection from '../user/collection';
import CategoryCollection from '../category/collection';
import { FriendCollection, FriendRequestCollection } from '../friend/collection';

/**
 * This files contains a class that has the functionality to explore goals
 * stored in MongoDB, including adding, finding, updating, and deleting goals.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Goal> is the output of the GoalModel() constructor,
 * and contains all the information in Goal. https://mongoosejs.com/docs/typescript.html
 */
class GoalCollection {

  static async checkAccess(userId: Types.ObjectId | string, goal: Goal): Promise<Boolean> {
    const priv = goal.private;
    const ownerId = goal.authorId._id.toString();

    // user is the owner of the goal
    if (ownerId === userId) {
      return true;
    }

    // if private, no one except owner can see
    if (priv) {
      return false;
    }

    // user is a friend
    const friendship = await FriendCollection.findOneFriend(ownerId, userId)
    if (friendship) {
      return true;
    }

    // anyone else can't see
    return false;
  }

  /**
   * Add a goal to the collection
   *
   * @param {string} authorId - The id of the author of the goal
   * @param {string} content - The id of the content of the goal
   * @return {Promise<HydratedDocument<Goal>>} - The newly created goal
   */
  static async addOne(authorId: Types.ObjectId | string, categoryName: string, hours: number, type: string, priv: boolean): Promise<HydratedDocument<Goal>> {

    const category = await CategoryCollection.findByNameAndUserId(authorId, categoryName);

    const date = new Date();
    const goal = new GoalModel({
      authorId,
      category: category.id,
      dateCreated: date,
      hours,
      type,
      private: priv,
    });
    await goal.save(); // Saves goal to MongoDB
    return goal.populate(['authorId', 'category']);
  }

  /**
   * Find a goal by goalId (used by middleware)
   *
   * @param {string} goalId - The id of the goal to find
   * @return {Promise<HydratedDocument<Goal>> | Promise<null> } - The goal with the given goalId, if any
   */
  static async findOneById(goalId: Types.ObjectId | string): Promise<HydratedDocument<Goal>> {
    return GoalModel.findOne({ _id: goalId }).populate(['authorId', 'category']);
  }

  /**
   * Find a goal by categoryId (used by middleware)
   */
  static async findOneByCategoryId(goalId: Types.ObjectId | string): Promise<HydratedDocument<Goal>> {
    return GoalModel.findOne({ category: goalId }).populate(['authorId', 'category']);
  }

  /**
   * Get all the goals in by given author
   */
  static async findAllByUsername(userId: string, username: string): Promise<Array<HydratedDocument<Goal>>> {
    const author = await UserCollection.findOneByUsername(username);
    const goals = await GoalModel.find({ authorId: author._id }).sort({ dateCreated: -1 }).populate(['authorId', 'category']);

    const result = [];
    for (const goal of goals) {
      const accessGranted = await this.checkAccess(userId, goal);
      if (accessGranted) {
        result.push(goal);
      }
    }
    return result;
  }

  /**
   * Get all the goals in by given author
   * Used EXCLUSIVELY for requesting logged in user's goals - doesn't do any access checking
   */
  static async findAllByUserId(userId: string): Promise<Array<HydratedDocument<Goal>>> {
    const goals = await GoalModel.find({ authorId: userId }).sort({ dateCreated: -1 }).populate(['authorId', 'category']);
    return goals;
  }

  /**
   * Get all goals written by an author friends with the user
   */
  static async findAllInFeed(userId: string): Promise<Array<HydratedDocument<Goal>>> {
    // Get all of the users that this user is friends with
    const friendIdsRaw = await FriendCollection.findAllFriendIds(userId);

    const friendIds = friendIdsRaw.map(id => {
      return { authorId: id };
    });

    if (friendIds.length === 0) {
      return [];
    }

    const goals = await GoalModel.find({ $or: friendIds }).sort({ dateCreated: -1 }).populate(['authorId', 'category']);
    const result = [];
    for (const goal of goals) {
      const accessGranted = await this.checkAccess(userId, goal);
      if (accessGranted) {
        result.push(goal);
      }
    }
    return result;
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
