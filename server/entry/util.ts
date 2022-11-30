import type { HydratedDocument } from 'mongoose';
import moment from 'moment';
import type { Entry, PopulatedEntry } from './model';

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

  const { username } = entryCopy.authorId;
  const { name } = entryCopy.category;
  console.log(name)
  delete entryCopy.authorId;
  delete entryCopy.category;
  return {
    ...entryCopy,
    _id: entryCopy._id.toString(),
    category: name,
    author: username,
    start: formatDate(entry.start),
    end: formatDate(entry.end),
  };
};

export {
  constructEntryResponse
};
