import express from "express";
import cors from "cors";
import postsRouter from "./routes/posts.js";
import repliesRouter from "./routes/replies.js";
import authRouter from "./routes/auth.js";
import likesRouter from "./routes/likes.js";

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use("/posts", postsRouter);
app.use("/replies", repliesRouter);
app.use("/auth", authRouter);
app.use("/likes", likesRouter);

export default app;
