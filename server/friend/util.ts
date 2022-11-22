import type {HydratedDocument, Types} from 'mongoose';
import type {Friend, FriendRequest, PopulatedFriend, PopulatedFriendRequest} from './model';

type FriendResponse = {
  _id: string;
  friendship: [string, string];
  dateFriends: Date;
};

type FriendRequestResponse = {
  _id: string;
  requesterUsername: string;
  requesteeUsername: string;
  dateRequested: Date;
  status: string;
};

const constructFriendResponse = (friend: HydratedDocument<Friend>): FriendResponse => {
  const friendCopy: PopulatedFriend = {
    ...friend.toObject()
  };
  return {
    _id: friendCopy._id.toString(),
    friendship: friendCopy.friendship.map(user => user.username) as [string, string],
    dateFriends: friendCopy.dateFriends
  };
};

const constructFriendRequestResponse = (friendRequest: HydratedDocument<FriendRequest>): FriendRequestResponse => {
  const friendRequestCopy: PopulatedFriendRequest = {
    ...friendRequest.toObject()
  };
  const requesterUsername = friendRequestCopy.requester.username;
  const requesteeUsername = friendRequestCopy.requestee.username;
  return {
    _id: friendRequestCopy._id.toString(),
    requesterUsername,
    requesteeUsername,
    dateRequested: friendRequestCopy.dateRequested,
    status: friendRequestCopy.status
  };
};

export {
  constructFriendResponse,
  constructFriendRequestResponse
};
