import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';
import type { User } from '../user/model';

/**
 * This file defines the properties stored in a Private Circle
 */

// Type definition for Private Circle on the backend
export type PrivateCircle = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string,
  ownerId: Types.ObjectId;
  members: Array<Types.ObjectId>;
};

export type PopulatedPrivateCircle = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string,
  ownerId: User;
  members: Array<User>;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Private Circles stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const PrivateCircleSchema = new Schema<PrivateCircle>({
  // The name of the Private Circle
  name: {
    type: String,
    required: true
  },
  // The owner userId
  ownerId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  members: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    required: true
  }
});

const PrivateCircleModel = model<PrivateCircle>('PrivateCircle', PrivateCircleSchema);
export default PrivateCircleModel;
