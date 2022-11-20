import type {HydratedDocument} from 'mongoose';
import type {PrivateCircle, PopulatedPrivateCircle} from '../privatecircle/model';

// Update this if you add a property to the PrivateCircle type!
type PrivateCircleResponse = {
  _id: string;
  owner: string;
  name: string;
};

/**
 * Transform a raw PrivateCircle object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<PrivateCircle>} privateCircle - A privateCircle
 * @returns {PrivateCircleResponse} - The private circle object formatted for the frontend
 */
const constructPrivateCircleResponse = (privateCircle: HydratedDocument<PrivateCircle>): PrivateCircleResponse => {
  const privateCircleCopy: PopulatedPrivateCircle = {
    ...privateCircle.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username: ownerId} = privateCircleCopy.ownerId;
  delete privateCircleCopy.ownerId;
  return {
    ...privateCircleCopy,
    _id: privateCircleCopy._id.toString(),
    owner: ownerId,
  };
};

export {
  constructPrivateCircleResponse
};
