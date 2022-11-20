import type { Request, Response, NextFunction } from 'express';
import FollowCollection from '../follow/collection';
import UserCollection from '../user/collection';
import PrivateCircleCollection from './collection';

/**
 * Checks if this is a valid Private Circle creation
 */
const isValidCreatePrivateCircle = async (req: Request, res: Response, next: NextFunction) => {
    const name = req.body.name;
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    if (!name.trim()) {
        res.status(400).json({
            error: 'Private Circle name must be at least one character long.'
        });
        return;
    }
    if (!/^[\w\-\s]+$/.test(name)) {
        res.status(400).json({
            error: 'Private Circle name must contain only letters, numbers, and spaces.'
        });
        return;
    }
    const privateCircle = await PrivateCircleCollection.findPrivateCircleByOwnerAndName(userId, name);
    if (privateCircle) {
        res.status(409).json({
            error: `Private Circle with name ${name} already exists.`
        });
        return;
    }
    next();
};

/**
 * Checks if this is a valid Private Circle deletion
 */
const isValidDeletePrivateCircle = async (req: Request, res: Response, next: NextFunction) => {
    const name = req.params.privateCircle;
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const privateCircle = await PrivateCircleCollection.findPrivateCircleByOwnerAndName(userId, name);
    if (!privateCircle) {
        res.status(404).json({
            error: `Private Circle with name ${name} does not exist.`
        });
        return;
    }
    next();
};

/**
 * Checks if this is a valid Private Circle update
 */
const isValidUpdatePrivateCircle = async (req: Request, res: Response, next: NextFunction) => {
    const name = req.params.privateCircle;
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const privateCircle = await PrivateCircleCollection.findPrivateCircleByOwnerAndName(userId, name);
    if (!privateCircle) {
        res.status(404).json({
            error: `Private Circle with name ${name} does not exist.`
        });
        return;
    }
    const userToUpdate = await UserCollection.findOneByUsername(req.body.username);
    if (!userToUpdate) {
        res.status(404).json({
            error: `User with with username ${req.body.username} does not exist.`
        });
        return;
    }
    const user = await UserCollection.findOneByUserId(userId);
    const follow = await FollowCollection.findOneFollowByUsernames(req.body.username, user.username)
    if (!follow) {
        res.status(403).json({
            error: `People in your Private Circle must follow you.`
        });
        return;
    }
    next();
};

/**
 * Checks if this is a valid Private Circle update
 */
const isExistingPrivateCircle = async (req: Request, res: Response, next: NextFunction) => {
    const name = req.body.private_circle;
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const privateCircle = await PrivateCircleCollection.findPrivateCircleByOwnerAndName(userId, name);
    if (!privateCircle) {
        res.status(404).json({
            error: `Private Circle with name ${name} does not exist.`
        });
        return;
    }
    next();
};

export {
    isValidCreatePrivateCircle,
    isValidDeletePrivateCircle,
    isValidUpdatePrivateCircle,
    isExistingPrivateCircle
};
