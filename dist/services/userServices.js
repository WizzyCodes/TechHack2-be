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
exports.receiveFriendRequest = exports.sendFriendRequest = exports.findUserByLocation = void 0;
// import { Request } from "express";
const userModel_1 = __importDefault(require("../model/userModel"));
const findUserByLocation = (location) => __awaiter(void 0, void 0, void 0, function* () {
    return yield userModel_1.default.find({ location });
});
exports.findUserByLocation = findUserByLocation;
const sendFriendRequest = (senderEmail, receiverEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const receiver = yield userModel_1.default.findOne({ email: receiverEmail });
    const sender = yield userModel_1.default.findOne({ email: senderEmail });
    if (!receiver || !sender)
        throw new Error("Receiver or sender not found");
    receiver.friendRequest.push({
        sender: senderEmail,
        status: "pending",
    });
    yield receiver.save();
});
exports.sendFriendRequest = sendFriendRequest;
const receiveFriendRequest = (senderEmail, receiverEmail, status) => __awaiter(void 0, void 0, void 0, function* () {
    const receiver = yield userModel_1.default.findOne({ email: receiverEmail });
    if (!receiver)
        throw new Error("Friend not found");
    const friendRequest = yield userModel_1.default.findOne({ email: senderEmail });
    if (!friendRequest) {
        throw new Error("Friend request not found");
    }
    // friendRequest.status = status;
    if (status === "accepted") {
        const sender = yield userModel_1.default.findOne({ email: senderEmail });
        if (sender) {
            sender.friends = +1;
            yield sender.save();
        }
        receiver.friends = +1;
        receiver.friendRequest.push({
            sender: senderEmail,
            status: "accepted",
        });
        // friendRequest.status = "accepted";
        yield receiver.save();
    }
    else if (status === "declined") {
        receiver.friendRequest.push({
            sender: senderEmail,
            status: "declined",
        });
        yield receiver.save();
    }
});
exports.receiveFriendRequest = receiveFriendRequest;
