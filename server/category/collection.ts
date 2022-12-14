import type {HydratedDocument, Types} from 'mongoose';
import type {Category, PopulatedCategory} from './model';
import CategoryModel from './model';
import UserCollection from '../user/collection';
import GoalCollection from '../goal/collection';
import EntryCollection from '../entry/collection';

class CategoryCollection {
  static async findAllByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Category>>> {
    const user = await UserCollection.findOneByUserId(userId);
    const categories = await CategoryModel.find({userId: user._id}).sort({dateCreated: -1}).populate('userId');
    return categories;
  }

  static async findById(id: Types.ObjectId | string): Promise<HydratedDocument<Category>> {
    const category = await CategoryModel.findOne({id}).populate('userId');
    return category;
  }

  static async findByNameAndUserId(userId: Types.ObjectId | string, name: string): Promise<HydratedDocument<Category>> {
    const category = await CategoryModel.findOne({userId, name}).populate('userId');
    return category;
  }

  static async addOne(userId: Types.ObjectId | string, name: string): Promise<HydratedDocument<Category>> {
    const date = new Date();
    const category = new CategoryModel({
      userId,
      name,
      dateCreated: date,
    });
    await category.save(); // Saves goal to MongoDB
    return category.populate('userId');
  }

  static async deleteOne(userId: Types.ObjectId | string, name: string): Promise<boolean> {
    const user = await UserCollection.findOneByUserId(userId);
    const category = await CategoryCollection.findByNameAndUserId(userId, name);

    // Delete corresponding goal if it exists
    const goal = await GoalCollection.findOneByCategoryId(category._id);
    if (goal) {
      await GoalCollection.deleteOne(goal._id);
    }

    // Delete all time entries with this category
    await EntryCollection.deleteAllInCategory(category._id);

    const deletedCategory = await CategoryModel.deleteOne({userId: user._id, name});
    return deletedCategory !== null;
  }

  static async renameOne(userId: Types.ObjectId | string, oldName: string, newName: string): Promise<HydratedDocument<Category>> {
    const user = await UserCollection.findOneByUserId(userId);
    const category = await CategoryModel.findOne({userId: user._id, name: oldName});
    category.name = newName;
    await category.save();
    return category.populate('userId');
  }
}

export default CategoryCollection;
