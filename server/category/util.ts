import type {HydratedDocument} from 'mongoose';
import type {Category, PopulatedCategory} from './model';
import moment from 'moment';

type CategoryResponse = {
  _id: string;
  userId: string;
  name: string;
  dateCreated: string;
};

const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm a');

/**
 * Transform a raw Category object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Category>} category - A Category object
 * @returns {CategoryT} - The Category object
 */

const constructCategoryResponse = (category: HydratedDocument<Category>): CategoryResponse => {
  const categoryCopy: PopulatedCategory = {
    ...category.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = categoryCopy.userId;
  delete categoryCopy.userId;
  return {
    ...categoryCopy,
    _id: categoryCopy._id.toString(),
    userId: username,
    dateCreated: formatDate(category.dateCreated),
  };
};

export {
  constructCategoryResponse
};
