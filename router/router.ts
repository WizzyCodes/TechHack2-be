import { Router } from "express";
import {
  createUser,
  getUserLikes,
  handleFriendRequest,
  // handleRequest,
  likeUser,
  searchUserLocation,
  sendRequest,
} from "../controlller/userController";

const router: any = Router();

router.route("/search-location").get(searchUserLocation);
router.route("/create-user").post(createUser);
router.route("/send-friend-request").post(sendRequest);
router.route("/handle-friend-request").post(handleFriendRequest);
router.route("/like-user/:userID/:likedUserID").post(likeUser);
router.route("/get-likes/:likedUserID").get(getUserLikes);

export default router;
