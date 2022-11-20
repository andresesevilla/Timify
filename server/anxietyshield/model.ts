import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';
import type { User } from '../user/model';

/**
 * This file defines the properties stored in an AnxietyShield
 */

// Type definition for AnxietyShield on the backend
export type AnxietyShield = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  ownerId: Types.ObjectId;
  shieldedTopics: Array<string>;
};

export type PopulatedAnxietyShield = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  ownerId: User;
  shieldedTopics: Array<string>;
};

// Mongoose schema definition for interfacing with a MongoDB table
// AnxietyShields stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const AnxietyShieldSchema = new Schema<AnxietyShield>({
  // The author userId
  ownerId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  shieldedTopics: {
    type: [
      { type: String }
    ],
    required: true,
    default: []
  }
});

const AnxietyShieldModel = model<AnxietyShield>('AnxietyShield', AnxietyShieldSchema);
export default AnxietyShieldModel;
