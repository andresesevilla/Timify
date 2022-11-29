import type {HydratedDocument, Types} from 'mongoose';
import type {Category, CategoryT} from './model';
import CategoryModel from './model';

class CategoryCollection {
  /**
   * Find a Category by userId. If does not exist, creates one and returns that.
   *
   * @param userId - The _id to look for an entry for
   * @returns The entry with the given id, if any
   */
  static async findOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<Category>> {
    const one = await CategoryModel.findOne({userId});
    if (!one) {
      const populate = new CategoryModel({userId, dateUpdated: new Date()});
      await populate.save();
      return populate;
    }

    return one;
  }

  /**
   * Find a Category by categoryId.
   *
   * @param categoryId - The _id to look for an entry for
   * @returns The entry with the given id, if any
   */
  static async findOneByCategoryId(categoryId: Types.ObjectId | string): Promise<HydratedDocument<Category>> {
    return CategoryModel.findOne({_id: categoryId});
  }

  /**
   * Update by categoryId.
   *
   * @param categoryId - The _id of Category entry to update
   * @param categoryEntries - Category entries
   * @returns - The updated Category entry.
   */
  static async updateOneByCategoryId(categoryId: Types.ObjectId | string, categoryEntries: CategoryT): Promise<HydratedDocument<Category>> {
    const category = await CategoryModel.findOne({_id: categoryId});
    category.entries = categoryEntries;
    category.dateUpdated = new Date();
    await category.save();
    return category;
  }

  /**
   * Update by userId.
   *
   * @param userId - The _id of Category entry to update
   * @param categoryEntries - Category entries
   * @returns - The updated Category entry.
   */
  static async updateOneByUserId(userId: Types.ObjectId | string, categoryEntries: CategoryT): Promise<HydratedDocument<Category>> {
    const category = await CategoryModel.findOneAndUpdate({userId}, {entries: categoryEntries, dateUpdated: new Date()});
    return category;
  }
}

export default CategoryCollection;
