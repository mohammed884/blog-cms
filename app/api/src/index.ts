import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import compression from "compression";
import authRouter from "./routes/auth";
import articleRouter from "./routes/article";
import commentRouter from "./routes/comment";
import interestsRouter from "./routes/interest";
import dayjs from "dayjs";
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
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));

// routes
app.use("/auth", authRouter);
app.use("/articles", articleRouter);
app.use("/comments", commentRouter);
app.use("/interests", interestsRouter);
//serve the app
app.listen(process.env.PORT, () => {
  console.log("Server is running on port: " + process.env.PORT);
});
