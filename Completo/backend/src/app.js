import express from "express";
import cors from "cors";
import postsRouter from "./routes/posts.js";
import repliesRouter from "./routes/replies.js";
import authRouter from "./routes/auth.js";
import likesRouter from "./routes/likes.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/posts", postsRouter);
app.use("/replies", repliesRouter);
app.use("/auth", authRouter);
app.use("/likes", likesRouter);

export default app;
