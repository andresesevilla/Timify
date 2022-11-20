import type {HydratedDocument} from 'mongoose';
import type {Follow, PopulatedFollow} from '../follow/model';

// Update this if you add a property to the Follow type!
type FollowResponse = {
  _id: string;
  follower: string;
  followee: string;
};

/**
 * Transform a raw Follow object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Follow>} follow - A follow
 * @returns {FollowResponse} - The follow object formatted for the frontend
 */
const constructFollowResponse = (follow: HydratedDocument<Follow>): FollowResponse => {
  const followCopy: PopulatedFollow = {
    ...follow.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username: followee} = followCopy.followeeId;
  const {username: follower} = followCopy.followerId;
  delete followCopy.followeeId;
  delete followCopy.followerId;

  return {
    ...followCopy,
    _id: followCopy._id.toString(),
    followee: followee,
    follower: follower
  };
};

export {
  constructFollowResponse
};
