import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import UserCollection from '../user/collection';
import {FriendCollection, FriendRequestCollection} from './collection';
import * as UserValidator from '../user/middleware';
import * as FriendValidator from './middleware';
import * as util from './util';

const router = express.Router();

// Get a user's friends (logged in user or given user)
router.get(
  '/list/:friend?',
  [
    UserValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const allFriends = await FriendCollection.findAllFriends(userId);
    const response = allFriends.map(util.constructFriendResponse);
    res.status(200).json(response);
  }
);

// Unfriend given user
router.delete(
  '/list/:friend?',
  [
    UserValidator.isUserLoggedIn,
    FriendValidator.isValidUser,
    FriendValidator.isFriend
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const {friend} = req.params;
    const friendId = (await UserCollection.findOneByUsername(friend))._id;
    await Promise.all([
      FriendCollection.deleteOneFriend(userId, friendId)
    ]);

    res.status(200).json({
      message: `You unfriended ${friend}.`
    });
  }
);

// Get friendship status with given user
router.get(
  '/status/:username?',
  [
    UserValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    if (!req.params.username) {
      return res.status(400).json({
        error: 'Username not provided.'
      });
    }

    const userId = req.session.userId as string;
    const {username} = req.params;
    const user = await UserCollection.findOneByUsername(username);
    if (!user) {
      return res.status(404).json({
        error: `User ${username} does not exist.`
      });
    }

    const friend = await FriendCollection.findOneFriend(userId, user._id);
    if (friend) {
      return res.status(200).json({
        status: 'friends'
      });
    }

    const request = await FriendRequestCollection.findPendingFriendRequest(userId, user._id);
    if (request) {
      return res.status(200).json({
        status: 'request sent'
      });
    }

    const incomingRequest = await FriendRequestCollection.findPendingFriendRequest(user._id, userId);
    if (incomingRequest) {
      return res.status(200).json({
        status: 'request received'
      });
    }

    res.status(200).json({
      status: 'no'
    });
  }
);

// Get requests
router.get(
  '/requests',
  [
    UserValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const allFriendRequests = await FriendRequestCollection.findAllFriendRequests(userId);
    const response = allFriendRequests.map(util.constructFriendRequestResponse);
    res.status(200).json(response);
  }
);

// Create a new friend request
router.put(
  '/requests/:requestee?',
  [
    UserValidator.isUserLoggedIn,
    FriendValidator.isValidUser,
    FriendValidator.isValidRequestee,
    FriendValidator.isNotAlreadyFriends,
    FriendValidator.isFriendRequestNotExists
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const {requestee} = req.params;
    const requesteeId = (await UserCollection.findOneByUsername(requestee))._id;
    const friendRequest = await FriendRequestCollection.addOneFriendRequest(userId, requesteeId);

    res.status(201).json({
      message: `You sent a friend request to ${requestee}.`,
      friendRequest: util.constructFriendRequestResponse(friendRequest)
    });
  }
);

// Undo a friend request you sent
router.delete(
  '/requests/:requestee?',
  [
    UserValidator.isUserLoggedIn,
    FriendValidator.isValidUser,
    FriendValidator.isFriendRequestExists
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const {requestee} = req.params;
    const requesteeId = (await UserCollection.findOneByUsername(requestee))._id;
    await FriendRequestCollection.deleteOneFriendRequest(userId, requesteeId);
    res.status(200).json({
      message: `You withdrew a friend request to ${requestee}.`
    });
  }
);

// Respond to a friend request
router.put(
  '/requests/respond/:requester?',
  [
    UserValidator.isUserLoggedIn,
    FriendValidator.isValidUser,
    FriendValidator.isFriendRequestExists,
    FriendValidator.isValidResponse
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const {requester} = req.params;
    const response = req.body.response as string;
    const requesterId = (await UserCollection.findOneByUsername(requester))._id.toString();
    await FriendRequestCollection.deleteOneFriendRequest(requesterId, userId);
    if (response === 'accept') {
      await FriendCollection.addOneFriend(userId, requesterId);
    }

    res.status(200).json({
      message: `You ${response}ed a friend request from ${requester}.`
    });
  }
);

export {
  router as friendRouter
};
