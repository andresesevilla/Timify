import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type { User } from '../user/model';

export type Category = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
};

export type PopulatedCategory = {
  _id: Types.ObjectId;
  userId: User;
  name: string;
};

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const CategoryModel = model<Category>('Category', CategorySchema);
export default CategoryModel;
