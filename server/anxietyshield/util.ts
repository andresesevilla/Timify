import type {HydratedDocument} from 'mongoose';
import type {AnxietyShield, PopulatedAnxietyShield} from '../anxietyshield/model';

// Update this if you add a property to the AnxietyShield type!
type AnxietyShieldResponse = {
  _id: string;
  owner: string;
};

/**
 * Transform a raw AnxietyShield object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<AnxietyShield>} anxietyShield - An anxietyShield
 * @returns {AnxietyShieldResponse} - The Anxiety Shield object formatted for the frontend
 */
const constructAnxietyShieldResponse = (anxietyShield: HydratedDocument<AnxietyShield>): AnxietyShieldResponse => {
  const anxietyShieldCopy: PopulatedAnxietyShield = {
    ...anxietyShield.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username: ownerId} = anxietyShieldCopy.ownerId;
  delete anxietyShieldCopy.ownerId;
  return {
    ...anxietyShieldCopy,
    _id: anxietyShieldCopy._id.toString(),
    owner: ownerId,
  };
};

export {
  constructAnxietyShieldResponse
};
