"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserLikes = exports.likeUser = exports.handleFriendRequest = exports.sendRequest = exports.searchUserLocation = exports.createUser = void 0;
const userServices_1 = require("../services/userServices");
const userModel_1 = __importDefault(require("../model/userModel"));
const email_1 = require("../utils/email");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, location } = req.body;
        const user = yield userModel_1.default.create({
            name,
            email,
            location,
        });
        return res.status(201).json({
            message: "User created successfully",
            status: 201,
            data: user,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Couldnt create user",
            status: 404,
        });
    }
});
exports.createUser = createUser;
const searchUserLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { location } = req.query;
        const users = yield (0, userServices_1.findUserByLocation)(location);
        if (users && users.length <= 0) {
            return res.status(404).json({
                message: "Couldnt find user",
                status: 404,
            });
        }
        else {
            return res.status(200).json({
                message: "User location found",
                status: 200,
                data: users,
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Couldnt find user",
            status: 404,
        });
    }
});
exports.searchUserLocation = searchUserLocation;
const sendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { senderEmail, receiverEmail } = req.body;
        const request = yield (0, userServices_1.sendFriendRequest)(senderEmail, receiverEmail);
        (0, email_1.friendRequestEmail)(senderEmail, receiverEmail);
        return res.status(201).json({
            message: "Friend Request sent",
            status: 201,
            data: request,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Couldnt send Request",
            status: 404,
        });
    }
});
exports.sendRequest = sendRequest;
const handleFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { senderEmail, receiverEmail, status } = req.body;
        const request = yield (0, userServices_1.receiveFriendRequest)(senderEmail, receiverEmail, status);
        return res.status(201).json({
            message: `friend Request ${status}`,
            status: 201,
            data: request,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "No friend request",
            status: 404,
        });
    }
});
exports.handleFriendRequest = handleFriendRequest;
const likeUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, likedUserID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        const likedUser = yield userModel_1.default.findById(likedUserID);
        if (!user || !likedUser) {
            return res.status(404).json({
                status: 404,
                message: "User or liked user not found",
            });
        }
        // if (likedUser.likedBy.includes(userID)) {
        //   return res.status(400).json({
        //     status: 400,
        //     message: "You have already liked this user",
        //   });
        // }
        const updatedUser = yield userModel_1.default.findByIdAndUpdate(likedUserID, {
            $inc: { likes: 1 },
            $addToSet: { likedBy: userID },
            // $push: { likedBy: userID },
        }, { new: true });
        return res.status(200).json({
            status: 200,
            message: "User liked successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 500,
            error: error,
        });
    }
});
exports.likeUser = likeUser;
const getUserLikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { likedUserID } = req.params;
        const userLikes = yield userModel_1.default
            .findById(likedUserID)
            .populate("likedBy", "name email");
        if (userLikes) {
            return res.status(200).json({
                status: 200,
                message: "User Likes gotten successfully",
                data: userLikes,
            });
        }
        else {
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            status: 500,
            error: error,
        });
    }
});
exports.getUserLikes = getUserLikes;
