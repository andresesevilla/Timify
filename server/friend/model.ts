import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type Friend = {
  _id: Types.ObjectId;
  friendship: [Types.ObjectId, Types.ObjectId];
  dateFriends: Date;
};

export type PopulatedFriend = {
  _id: Types.ObjectId;
  friendship: [User, User];
  dateFriends: Date;
};

const FriendSchema = new Schema<Friend>({
  friendship: {
    type: [{type: Schema.Types.ObjectId, ref: 'User'}],
    required: true,
    validate: {
      validator: (value: Types.ObjectId[]) => value.length === 2,
      message: 'Friendship must be between two users'
    }
  },
  dateFriends: {
    type: Date,
    required: true
  }
});

const FriendModel = model<Friend>('Friend', FriendSchema);

export type FriendRequest = {
  _id: Types.ObjectId;
  requester: Types.ObjectId;
  requestee: Types.ObjectId;
  dateRequested: Date;
  status: 'pending' | 'accepted' | 'rejected';
};

export type PopulatedFriendRequest = {
  _id: Types.ObjectId;
  requester: User;
  requestee: User;
  dateRequested: Date;
  status: 'pending' | 'accepted' | 'rejected';
};

const FriendRequestSchema = new Schema<FriendRequest>({
  requester: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  requestee: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  dateRequested: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'accepted', 'rejected']
  }
});

const FriendRequestModel = model<FriendRequest>('FriendRequest', FriendRequestSchema);

export {FriendModel, FriendRequestModel};
