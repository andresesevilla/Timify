import type { HydratedDocument } from 'mongoose';
import moment from 'moment';
import type { Goal, PopulatedGoal } from '../goal/model';
import EntryCollection from '../entry/collection';
import CategoryCollection from '../category/collection';

type GoalResponse = {
  _id: string;
  hours: number;
  category: string;
  author: string;
  dateCreated: string;
  type: string;
  private: boolean;
  progress: number;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm a');

/**
 * Transform a raw Goal object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Goal>} goal - A goal
 * @returns {GoalResponse} - The goal object formatted for the frontend
 */
const constructGoalResponse = async (goal: HydratedDocument<Goal>): Promise<GoalResponse> => {
  const goalCopy: PopulatedGoal = {
    ...goal.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  const { username } = goalCopy.authorId;
  const { name } = goalCopy.category;

  const mondayTime = new Date();
  mondayTime.setDate(mondayTime.getDate() + 1 - (mondayTime.getDay() || 7)); 
  mondayTime.setHours(0);
  mondayTime.setMinutes(0);
  mondayTime.setSeconds(0);

  const entriesAfterMonday = await EntryCollection.findAll(goal.authorId._id.toString(), name, mondayTime, undefined);

  let progress = 0
  for (const entry of entriesAfterMonday) {
    progress += entry.end.getTime() - Math.max(entry.start.getTime(), mondayTime.getTime());
  }
  progress /= 3600000;

  delete goalCopy.authorId;
  delete goalCopy.category;

  return {
    ...goalCopy,
    _id: goalCopy._id.toString(),
    category: name,
    author: username,
    dateCreated: formatDate(goal.dateCreated),
    progress,
  };
};

export {
  constructGoalResponse
};
