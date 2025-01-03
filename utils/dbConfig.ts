import { connect } from "mongoose";
import env from "dotenv";
env.config();

export const dbConfig = async () => {
  try {
    await connect(process.env.MONGO_LIVE_URL as string).then(() => {
      console.clear();
      console.log("Database connected🚀🚀");
    });
  } catch (error) {
    return error;
  }
};
