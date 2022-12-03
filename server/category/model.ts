import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type Category = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  dateCreated: Date;
};

export type PopulatedCategory = {
  _id: Types.ObjectId;
  userId: User;
  name: string;
  dateCreated: Date;
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
  },
  dateCreated: {
    type: Date,
    required: true
  },
});

const CategoryModel = model<Category>('Category', CategorySchema);
export default CategoryModel;
