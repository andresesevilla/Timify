import type { HydratedDocument, Types } from 'mongoose';
import type { AnxietyShield } from './model';
import UserCollection from '../user/collection';
import AnxietyShieldModel from './model';

/**
 * This files contains a class that has the functionality to explore anxiety shields
 * stored in MongoDB, including adding, finding, updating, and deleting anxiety shields.
 * Feel free to add additional operations in this file.
 */
class AnxietyShieldCollection {
    /**
     * Add an anxiety shield to the collection
     *
     * @param {string} ownerId - The id of the owner of the anxiety shield
     * @return {Promise<HydratedDocument<AnxietyShield>>} - The newly created anxiety shield
     */
    static async addOne(ownerId: Types.ObjectId | string): Promise<HydratedDocument<AnxietyShield>> {
        const anxietyShield = new AnxietyShieldModel({ownerId});
        await anxietyShield.save(); // Saves freet to MongoDB
        return anxietyShield.populate('ownerId');
    }

    /**
     * Get a user's anxiety shield
     *
     * @param {string} userId - owner of the anxiety shield
     * @return {Promise<HydratedDocument<AnxietyShield>[]>} - The anxiety shield
     */
    static async findAnxietyShieldByOwner(userId: Types.ObjectId | string): Promise<HydratedDocument<AnxietyShield>> {
        const user = await UserCollection.findOneByUserId(userId);
        return AnxietyShieldModel.findOne({ ownerId: user._id}).populate(['ownerId']);
    }

    /**
     * Update a specific anxiety shield (toggle a topic's membership)
     *
     * @param {string} userId - owner of the anxiety shield
     * @param {string} topic - topic to be added or removed from anxiety shield
     */
    static async updateAnxietyShield(userId: string, topic: string): Promise<HydratedDocument<AnxietyShield>> {
        const user = await UserCollection.findOneByUserId(userId);
        const anxietyShield = await AnxietyShieldModel.findOne({ ownerId: user._id })
        const topics = anxietyShield.shieldedTopics;
        if (topics.includes(topic)) {
            topics.splice(topics.indexOf(topic), 1)
        } else {
            topics.push(topic)
        }
        anxietyShield.shieldedTopics = topics;
        await anxietyShield.save();
        return anxietyShield.populate('ownerId');
    }
}

export default AnxietyShieldCollection;
