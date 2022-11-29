import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type CategoryT = Array<{name: string}>;

export type Category = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  entries: CategoryT;
  dateUpdated: Date;
};

const CategorySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  entries: {
    type: [{
      name: {
        type: String,
        required: true
      }
    }],
    _id: false,
    required: true,
    default: [
      {name: 'Gym'},
      {name: 'School'}
    ]
  },
  dateUpdated: {
    type: Date,
    required: true
  }
}, {
  toObject: {versionKey: false}
});

CategorySchema.index({userId: 1});

const CategoryModel = model<Category>('Category', CategorySchema);
export default CategoryModel;
