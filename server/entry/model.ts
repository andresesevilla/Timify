import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';
import { Category } from 'server/category/model';
import type { User } from '../user/model';

/**
 * This file defines the properties stored in an Entry
 */

// Type definition for Entry on the backend
export type Entry = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  category: Types.ObjectId;
  authorId: Types.ObjectId;
  start: Date;
  end: Date;
  tag: string;
};

export type PopulatedEntry = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  category: Category;
  authorId: User;
  start: Date;
  end: Date;
  tag: string;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Entrys stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const EntrySchema = new Schema<Entry>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  category: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Category'
  },
  // The date the entry was created
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  tag: {
    type: String,
    required: false
  },
});

const EntryModel = model<Entry>('Entry', EntrySchema);
export default EntryModel;
