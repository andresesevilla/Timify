import type { HydratedDocument, Types } from 'mongoose';
import type { PrivateCircle } from './model';
import UserCollection from '../user/collection';
import PrivateCircleModel from './model';
import FreetCollection from '../freet/collection';

/**
 * This files contains a class that has the functionality to explore private circles
 * stored in MongoDB, including adding, finding, updating, and deleting private circles.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class PrivateCircleCollection {
  /**
   * Add a private circle to the collection
   *
   * @param {string} ownerId - The id of the owner of the private circle
   * @param {string} name - The name of the private circle
   * @return {Promise<HydratedDocument<PrivateCircle>>} - The newly created private circle
   */
  static async addOne(ownerId: Types.ObjectId | string, name: string): Promise<HydratedDocument<PrivateCircle>> {
    const privateCircle = new PrivateCircleModel({
      ownerId,
      name
    });
    await privateCircle.save(); // Saves freet to MongoDB
    return privateCircle.populate(['ownerId', 'members']);
  }

  /**
   * Get a user's private circles
   *
   * @param {string} userId - User whose private circles we are looking up
   * @return {Promise<HydratedDocument<PrivateCircle>[]>} - An array of all of the private circles
   */
  static async findAllPrivateCirclesByUsername(userId: string): Promise<Array<HydratedDocument<PrivateCircle>>> {
    const user = await UserCollection.findOneByUserId(userId);
    return PrivateCircleModel.find({ ownerId: user._id }).populate(['ownerId', 'members']);
  }

  /**
   * Get a specific private circle
   *
   * @param {string} userId - owner of the private circle
   * @param {string} name - name of the private circle
   * @return {Promise<HydratedDocument<PrivateCircle>[]>} - The private circle
   */
  static async findPrivateCircleByOwnerAndName(userId: Types.ObjectId | string, name: string): Promise<HydratedDocument<PrivateCircle>> {
    const user = await UserCollection.findOneByUserId(userId);
    return PrivateCircleModel.findOne({ ownerId: user._id, name: name });
  }

  /**
   * Delete a specific private circle
   *
   * @param {string} userId - owner of the private circle
   * @param {string} name - name of the private circle
   */
  static async deletePrivateCircleByOwnerAndName(userId: string, name: string): Promise<void> {
    const user = await UserCollection.findOneByUserId(userId);
    await FreetCollection.deleteMany(name);
    await PrivateCircleModel.deleteOne({ ownerId: user._id, name: name });
  }

  /**
   * Update a specific private circle
   *
   * @param {string} userId - owner of the private circle
   * @param {string} name - name of the private circle
   * @param {string} username - username to be added or removed from private circle
   */
  static async updatePrivateCircle(userId: string, name: string, username: string): Promise<HydratedDocument<PrivateCircle>> {
    const user = await UserCollection.findOneByUserId(userId);
    const privateCircle = await PrivateCircleModel.findOne({ ownerId: user._id, name: name })
    const members = privateCircle.members;
    const userToToggle = await UserCollection.findOneByUsername(username);

    if (members.includes(userToToggle.id)) {
      members.splice(members.indexOf(userToToggle.id), 1)
    } else {
      members.push(userToToggle.id)
    }

    privateCircle.members = members;
    await privateCircle.save();
    return privateCircle.populate(['ownerId', 'members']);
  }

  /**
   * Remove user from another user's private circles
   *
   * @param {string} userIdToRemove - the user to remove from private circles
   * @param {string} userIdPrivateCirclesOwner - username of the user who owns the private circles
   */
  static async removeUserFromAnothersPrivateCircles(userIdToRemove: Types.ObjectId | string, userIdPrivateCirclesOwner: Types.ObjectId | string): Promise<void> {
    const userToRemove = await UserCollection.findOneByUserId(userIdToRemove);
    const privateCircles = await PrivateCircleModel.find({ ownerId: userIdPrivateCirclesOwner });
    for (const privateCircle of privateCircles) {
      const members = privateCircle.members;
      if (members.includes(userToRemove.id)) {
        members.splice(members.indexOf(userToRemove.id), 1)
      }
      await privateCircle.save();
    }
  }
}

export default PrivateCircleCollection;
