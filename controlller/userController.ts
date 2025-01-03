import { Request, Response } from "express";
import {
  findUserByLocation,
  receiveFriendRequest,
  sendFriendRequest,
} from "../services/userServices";
import userModel from "../model/userModel";
import { friendRequestEmail } from "../utils/email";

export const createUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, email, location } = req.body;
    const user = await userModel.create({
      name,
      email,
      location,
    });
    return res.status(201).json({
      message: "User created successfully",
      status: 201,
      data: user,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Couldnt create user",
      status: 404,
    });
  }
};

export const searchUserLocation = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { location } = req.query;
    const users = await findUserByLocation(location as string);
    if (users && users.length <= 0) {
      return res.status(404).json({
        message: "Couldnt find user",
        status: 404,
      });
    } else {
      return res.status(200).json({
        message: "User location found",
        status: 200,
        data: users,
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: "Couldnt find user",
      status: 404,
    });
  }
};

export const sendRequest = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { senderEmail, receiverEmail } = req.body;
    const request = await sendFriendRequest(senderEmail, receiverEmail);
    friendRequestEmail(senderEmail, receiverEmail);

    return res.status(201).json({
      message: "Friend Request sent",
      status: 201,
      data: request,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Couldnt send Request",
      status: 404,
    });
  }
};
export const handleFriendRequest = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { senderEmail, receiverEmail, status } = req.body;
    const request = await receiveFriendRequest(
      senderEmail,
      receiverEmail,
      status
    );
    return res.status(201).json({
      message: `friend Request ${status}`,
      status: 201,
      data: request,
    });
  } catch (error) {
    return res.status(404).json({
      message: "No friend request",
      status: 404,
    });
  }
};

export const likeUser = async (req: Request, res: Response) => {
  try {
    const { userID, likedUserID } = req.params;

    const user = await userModel.findById(userID);
    const likedUser = await userModel.findById(likedUserID);

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
    const updatedUser = await userModel.findByIdAndUpdate(
      likedUserID,
      {
        $inc: { likes: 1 },
        $addToSet: { likedBy: userID },
        // $push: { likedBy: userID },
      },
      { new: true }
    );

    return res.status(200).json({
      status: 200,
      message: "User liked successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error,
    });
  }
};

export const getUserLikes = async (req: Request, res: Response) => {
  try {
    const { likedUserID } = req.params;

    const userLikes = await userModel
      .findById(likedUserID)
      .populate("likedBy", "name email");
    if (userLikes) {
      return res.status(200).json({
        status: 200,
        message: "User Likes gotten successfully",
        data: userLikes,
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error,
    });
  }
};
