import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Goal, PopulatedGoal} from '../goal/model';

type GoalResponse = {
  _id: string;
  hours: number;
  author: string;
  dateCreated: string;
  type: string;
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
const constructGoalResponse = (goal: HydratedDocument<Goal>): GoalResponse => {
  const goalCopy: PopulatedGoal = {
    ...goal.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = goalCopy.authorId;
  delete goalCopy.authorId;
  return {
    ...goalCopy,
    _id: goalCopy._id.toString(),
    author: username,
    dateCreated: formatDate(goal.dateCreated),
  };
};

export {
  constructGoalResponse
};
