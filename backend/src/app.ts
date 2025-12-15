import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import taskRouter from "./controllers/task.controller";
import authRouter from "./controllers/auth.controller";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// mount routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tasks", taskRouter);

app.get("/", (req, res) => res.json({ ok: true }));

export default app;
