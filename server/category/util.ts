import type {HydratedDocument} from 'mongoose';
import type {Category, CategoryT} from './model';

/**
 * Transform a raw Category object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Category>} category - A Category object
 * @returns {CategoryT} - The Category object
 */
const constructCategoryResponse = (category: HydratedDocument<Category>): CategoryT => category.entries;

export {
  constructCategoryResponse
};
