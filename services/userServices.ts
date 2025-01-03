// import { Request } from "express";
import userModel from "../model/userModel";

export const findUserByLocation = async (location: string) => {
  return await userModel.find({ location });
};

export const sendFriendRequest = async (
  senderEmail: string,
  receiverEmail: string
) => {
  const receiver: any = await userModel.findOne({ email: receiverEmail });
  const sender = await userModel.findOne({ email: senderEmail });
  if (!receiver || !sender) throw new Error("Receiver or sender not found");
  receiver.friendRequest.push({
    sender: senderEmail,
    status: "pending",
  });
  await receiver.save();
};

export const receiveFriendRequest = async (
  senderEmail: string,
  receiverEmail: string,
  status: "accepted" | "declined"
) => {
  const receiver: any = await userModel.findOne({ email: receiverEmail });
  if (!receiver) throw new Error("Friend not found");

  const friendRequest: any = await userModel.findOne({ email: senderEmail });
  if (!friendRequest) {
    throw new Error("Friend request not found");
  }
  // friendRequest.status = status;

  if (status === "accepted") {
    const sender: any = await userModel.findOne({ email: senderEmail });
    if (sender) {
      sender.friends = +1;
      await sender.save();
    }
    receiver.friends = +1;
    receiver.friendRequest.push({
      sender: senderEmail,
      status: "accepted",
    });
    // friendRequest.status = "accepted";
    await receiver.save();
  } else if (status === "declined") {
    receiver.friendRequest.push({
      sender: senderEmail,
      status: "declined",
    });
    await receiver.save();
  }
};
