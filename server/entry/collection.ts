import type { HydratedDocument, Types } from 'mongoose';
import type { Entry } from './model';
import EntryModel from './model';
import UserCollection from '../user/collection';
import CategoryCollection from '../category/collection';

class EntryCollection {
  /**
   * Add a entry to the collection
   */
  static async addOne(authorId: Types.ObjectId | string, categoryName: string, start: string, end: string, tag: string): Promise<HydratedDocument<Entry>> {

    const category = await CategoryCollection.findByNameAndUserId(authorId, categoryName);

    const entry = new EntryModel({
      authorId,
      category: category.id,
      start: new Date(start),
      end: new Date(end),
      tag
    });

    await entry.save(); // Saves entry to MongoDB
    return entry.populate(['authorId', 'category']);
  }

  /**
   * Find an entry by entryId
   *
   * @param {string} entryId - The id of the entry to find
   * @return {Promise<HydratedDocument<Entry>> | Promise<null> } - The entry with the given entryId, if any
   */
  static async findOneById(entryId: Types.ObjectId | string): Promise<HydratedDocument<Entry>> {
    return EntryModel.findOne({ _id: entryId }).populate(['authorId', 'category']);
  }

  /**
   * Get all the entries in by given author
   *
   * @param {string} userId - The username of author of the entries
   * @return {Promise<HydratedDocument<Entry>[]>} - An array of all of the entries
   */
  static async findAllByUserId(userId: string): Promise<Array<HydratedDocument<Entry>>> {
    const entries = await EntryModel.find({ authorId: userId }).populate(['authorId', 'category']);
    return entries;
  }

  /**
   * Delete an entry with given entryId.
   *
   * @param {string} entryId - The entryId of entry to delete
   * @return {Promise<Boolean>} - true if the entry has been deleted, false otherwise
   */
  static async deleteOne(entryId: Types.ObjectId | string): Promise<boolean> {
    const entry = await EntryModel.deleteOne({ _id: entryId });
    return entry !== null;
  }
}

export default EntryCollection;
