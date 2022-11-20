import type { HydratedDocument, Types } from 'mongoose';
import type { Follow } from './model';
import FollowModel from './model';
import UserCollection from '../user/collection';
import PrivateCircleCollection from '../privatecircle/collection';

/**
 * This files contains a class that has the functionality to explore follows
 * stored in MongoDB, including adding, finding, and deleting follows.
 *
 * Note: HydratedDocument<Follow> is the output of the FollowModel() constructor,
 * and contains all the information in Follow. https://mongoosejs.com/docs/typescript.html
 */
class FollowCollection {
  /**
   * Create a follow
   *
   * @param {string} followerId - The id of the user creating the follow
   * @param {string} followeeId - The id of the user being followed
   * @return {Promise<HydratedDocument<Follow>>} - The newly created follow
   */
  static async addOne(followerId: Types.ObjectId | string, followeeId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    const follow = new FollowModel({
      followerId,
      followeeId
    });
    await follow.save(); // Saves follow to MongoDB
    return follow.populate(['followerId', 'followeeId']);
  }

  /**
   * Get a user's following
   *
   * @param {string} username - User whose following we are looking up
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the follows
   */
  static async findAllFollowingByUsername(username: string): Promise<Array<HydratedDocument<Follow>>> {
    const user = await UserCollection.findOneByUsername(username);
    return FollowModel.find({ followerId: user._id }).populate(['followerId', 'followeeId']);
  }

  /**
   * Get a user's followers
   *
   * @param {string} username - User whose followers we are looking up
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the follows
   */
  static async findAllFollowersByUsername(username: string): Promise<Array<HydratedDocument<Follow>>> {
    const user = await UserCollection.findOneByUsername(username);
    return FollowModel.find({ followeeId: user._id }).populate(['followerId', 'followeeId']);
  }

  /**
   * Get a specific follow
   *
   * @param {string} follower - User who is the follower
   * @param {string} followee - User who is the followee
   * @return {Promise<HydratedDocument<Follow>>} - The follow
   */
  static async findOneFollowByUsernames(follower: string, followee: string): Promise<HydratedDocument<Follow>> {
    const followerUser = await UserCollection.findOneByUsername(follower);
    const followeeUser = await UserCollection.findOneByUsername(followee);
    return FollowModel.findOne({ followeeId: followeeUser._id, followerId: followerUser._id }).populate(['followerId', 'followeeId']);
  }

  /**
   * Delete a follow
   *
   * @param {string} followerId - The id of the follower
   * @param {string} followeeId - The id of the followee
   * @return {Promise<HydratedDocument<Follow>>} - true if deleted, false otherwise
   */
  static async deleteOne(followerId: Types.ObjectId | string, followeeId: Types.ObjectId | string): Promise<Boolean> {
    const follow = await FollowModel.deleteOne({ followerId: followerId, followeeId: followeeId })
    await PrivateCircleCollection.removeUserFromAnothersPrivateCircles(followerId, followeeId);
    return follow != null;
  }
}

export default FollowCollection;
