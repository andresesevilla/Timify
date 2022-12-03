import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Entry, PopulatedEntry} from './model';

type EntryResponse = {
  _id: string;
  category: string;
  author: string;
  start: string;
  end: string;
  tag: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => date.toISOString();

/**
 * Transform a raw Entry object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Entry>} entry - A entry
 * @returns {EntryResponse} - The entry object formatted for the frontend
 */
const constructEntryResponse = (entry: HydratedDocument<Entry>): EntryResponse => {
  const entryCopy: PopulatedEntry = {
    ...entry.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  const {username} = entryCopy.authorId;
  const {name} = entryCopy.category;
  delete entryCopy.authorId;
  delete entryCopy.category;
  return {
    ...entryCopy,
    _id: entryCopy._id.toString(),
    category: name,
    author: username,
    start: formatDate(entry.start),
    end: formatDate(entry.end)
  };
};

const checkTimeMatchesConstraint = (timePeriodStart: Date, timePeriodEnd: Date, constraintStart: Date, constraintEnd: Date): boolean => {
  // No constraint
  if (isNaN(constraintStart.getTime()) && isNaN(constraintEnd.getTime())) {
    return true;
  }

  // Only start constraint
  if (!isNaN(constraintStart.getTime()) && isNaN(constraintEnd.getTime())) {
    return timePeriodEnd.getTime() - constraintStart.getTime() >= 0;
  }

  // Only end constraint
  if (isNaN(constraintStart.getTime()) && !isNaN(constraintEnd.getTime())) {
    return constraintEnd.getTime() - timePeriodStart.getTime() >= 0;
  }

  // Both constraints

  // start in between
  if (timePeriodStart.getTime() - constraintStart.getTime() >= 0 && constraintEnd.getTime() - timePeriodStart.getTime() >= 0) {
    return true;
  }

  // End in between
  if (timePeriodEnd.getTime() - constraintStart.getTime() >= 0 && constraintEnd.getTime() - timePeriodEnd.getTime() >= 0) {
    return true;
  }

  // Time period contains constraint
  if (constraintStart.getTime() - timePeriodStart.getTime() >= 0 && timePeriodEnd.getTime() - constraintEnd.getTime() >= 0) {
    return true;
  }

  return false;
};

export {
  constructEntryResponse,
  checkTimeMatchesConstraint
};
