import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import errorHandler from "./middleware/errorHandler.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Threadit API is running" });
});

app.use(errorHandler);

export default app;
