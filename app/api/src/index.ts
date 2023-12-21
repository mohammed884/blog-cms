import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import compression from "compression";
import authRouter from "./domains/auth";
import articleRouter from "./domains/article";
import collaborationRouter from "./domains/article/collaboration";
import commentRouter from "./domains/article/comment";
import likeRouter from "./domains/article/like";
import topicsRouter from "./domains/topic";
import userRouter from "./domains/user";
import followRouter from "./domains/user/follow";
import fileUpload from "express-fileupload";
import { IUser,IArticle } from "interfaces/global";
const app = express();
// coonect to database
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODB_URL);
mongoose.connection.on("connection", () =>
  console.log("DB connection established")
);
mongoose.connection.on("error", (e: Error) => console.log(e));
// applay middlewares
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(compression());
app.use(express.json());
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}))
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));
declare module 'express' {
  interface Request {
    user: IUser;
    requestedUser:IUser;
    article: IArticle;
  }
}
// routes
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/user", followRouter);
app.use("/article", articleRouter);
app.use("/article/comment", commentRouter);
app.use("/article/likes", likeRouter);
app.use("/article/collaboration", collaborationRouter);
app.use("/topics", topicsRouter);
//serve the app
app.listen(process.env.PORT, () => {
  console.log("Server is running on port: " + process.env.PORT);
});
