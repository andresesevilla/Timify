import type {HydratedDocument, Types} from 'mongoose';
import type {Entry} from './model';
import EntryModel from './model';
import CategoryCollection from '../category/collection';
import * as util from './util';

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

  static async addOneId(authorId: Types.ObjectId | string, categoryId: Types.ObjectId | string, start: Date, end: Date, tag: string): Promise<HydratedDocument<Entry>> {
    const entry = new EntryModel({
      authorId,
      category: categoryId,
      start: start,
      end: end,
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
    return EntryModel.findOne({_id: entryId}).populate(['authorId', 'category']);
  }

  static async updateOne(userId: Types.ObjectId | string, entryId: Types.ObjectId | string, categoryName: string, start: string, end: string, tag: string): Promise<HydratedDocument<Entry>> {
    const entry = await EntryModel.findOne({_id: entryId}).populate(['authorId', 'category']);

    const category = await CategoryCollection.findByNameAndUserId(userId, categoryName);

    entry.category = category.id;
    entry.start = new Date(start);
    entry.end = new Date(end);
    entry.tag = tag;

    await entry.save();
    return entry.populate(['authorId', 'category']);
  }

  static async updateOneTime(entryId: Types.ObjectId | string, start: Date, end: Date): Promise<HydratedDocument<Entry>> {
    const entry = await EntryModel.findOne({_id: entryId}).populate(['authorId', 'category']);

    entry.start = start;
    entry.end = end;

    await entry.save();
    return entry.populate(['authorId', 'category']);
  }

  /**
   * Get all the entries in by given author
   *
   * @param {string} userId - The username of author of the entries
   * @return {Promise<HydratedDocument<Entry>[]>} - An array of all of the entries
   */
  static async findAll(userId: string, categoryName: string, start: Date, end: Date): Promise<Array<HydratedDocument<Entry>>> {
    let query: Record<string, unknown> = {authorId: userId};
    if (categoryName) {
      const category = await CategoryCollection.findByNameAndUserId(userId, categoryName);
      query = {authorId: userId, category: category.id};
    }

    let entries = await EntryModel.find(query).populate(['authorId', 'category']);

    if (!start) {
      start = new Date('');
    }

    if (!end) {
      end = new Date('');
    }

    entries = entries.filter(entry => util.checkTimeMatchesConstraint(new Date(entry.start), new Date(entry.end), start, end));

    return entries;
  }

  /**
   * Delete an entry with given entryId.
   *
   * @param {string} entryId - The entryId of entry to delete
   * @return {Promise<Boolean>} - true if the entry has been deleted, false otherwise
   */
  static async deleteOne(entryId: Types.ObjectId | string): Promise<boolean> {
    const entry = await EntryModel.deleteOne({_id: entryId});
    return entry !== null;
  }

  // Delete all entries of given category
  static async deleteAllInCategory(categoryId: Types.ObjectId | string): Promise<boolean> {
    const entry = await EntryModel.deleteMany({category: categoryId});
    return entry !== null;
  }
}

export default EntryCollection;
