import type {HydratedDocument, Types} from 'mongoose';
import UserCollection from '../user/collection';
import type {Friend, FriendRequest} from './model';
import {FriendModel, FriendRequestModel} from './model';

type MongoId = Types.ObjectId | string;

class FriendCollection {
  static async findOneFriend(friend1: MongoId, friend2: MongoId): Promise<HydratedDocument<Friend>> {
    const friend = await FriendModel.findOne({friendship: {$all: [friend1, friend2]}});
    if (!friend) {
      return friend;
    }

    return friend.populate('friendship');
  }

  static async findAllFriends(userId: MongoId): Promise<Array<HydratedDocument<Friend>>> {
    return FriendModel.find({friendship: userId}).sort({dateFriends: -1}).populate('friendship');
  }

  static async findAllFriendUsernames(userId: MongoId): Promise<MongoId[]> {
    const friends = await FriendCollection.findAllFriends(userId);
    const friendUsernames = friends.map(friend => friend.friendship.find(user => user._id.toString() !== userId.toString())._id);
    return friendUsernames;
  }

  static async addOneFriend(friend1: MongoId, friend2: MongoId): Promise<HydratedDocument<Friend>> {
    const friend = new FriendModel({friendship: [friend1, friend2], dateFriends: new Date()});
    await friend.save();
    return friend.populate('friendship');
  }

  static async deleteOneFriend(friend1: MongoId, friend2: MongoId): Promise<HydratedDocument<Friend>> {
    const friend = await FriendModel.findOneAndDelete({friendship: {$all: [friend1, friend2]}});
    return friend.populate('friendship');
  }
}

class FriendRequestCollection {
  static async findPendingFriendRequest(requester: MongoId, requestee: MongoId): Promise<HydratedDocument<FriendRequest>> {
    const friendRequest = await FriendRequestModel.findOne({requester, requestee, status: 'pending'});
    if (!friendRequest) {
      return friendRequest;
    }

    return friendRequest.populate(['requester', 'requestee']);
  }

  static async findAllFriendRequests(userId: MongoId): Promise<Array<HydratedDocument<FriendRequest>>> {
    return FriendRequestModel.find({$or: [{requestee: userId}, {requester: userId}]})
      .sort({dateRequested: -1}).populate(['requester', 'requestee']);
  }

  static async addOneFriendRequest(requester: MongoId, requestee: MongoId): Promise<HydratedDocument<FriendRequest>> {
    const friendRequest = new FriendRequestModel({
      requester, requestee, dateRequested: new Date(), status: 'pending'
    });
    await friendRequest.save();
    return friendRequest.populate(['requester', 'requestee']);
  }

  static async deleteOneFriendRequest(requester: MongoId, requestee: MongoId): Promise<HydratedDocument<FriendRequest>> {
    const friendRequest = await FriendRequestModel.findOneAndDelete({requester, requestee});
    if (!friendRequest) {
      return friendRequest;
    }

    return friendRequest.populate(['requester', 'requestee']);
  }

  static async updateFriendRequest(requester: MongoId, requestee: MongoId, status: string): Promise<HydratedDocument<FriendRequest>> {
    const friendRequest = await FriendRequestModel.findOneAndUpdate({requester, requestee, status: 'pending'}, {status});
    if (!friendRequest) {
      return friendRequest;
    }

    return friendRequest.populate(['requester', 'requestee']);
  }
}

export {
  FriendCollection,
  FriendRequestCollection
};
