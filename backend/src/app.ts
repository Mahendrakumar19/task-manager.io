import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import taskRouter from "./controllers/task.controller";
import authRouter from "./controllers/auth.controller";

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://task-manager-io-chi.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// mount routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tasks", taskRouter);

app.get("/", (req, res) => res.json({ ok: true }));

export default app;
