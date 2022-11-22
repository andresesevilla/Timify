import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';
import type { User } from '../user/model';

/**
 * This file defines the properties stored in a Goal
 */

// Type definition for Goal on the backend
export type Goal = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  content: string;
  dateCreated: Date;
  hours: number;
  budget: boolean;
};

export type PopulatedGoal = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  content: string;
  dateCreated: Date;
  hours: number;
  budget: boolean;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Goals stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const GoalSchema = new Schema<Goal>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The date the goal was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The content of the goal
  content: {
    type: String,
    required: true
  },
  hours: {
    type: Number,
    required: true
  },
  budget: {
    type: Boolean,
    required: true
  },
});

const GoalModel = model<Goal>('Goal', GoalSchema);
export default GoalModel;
