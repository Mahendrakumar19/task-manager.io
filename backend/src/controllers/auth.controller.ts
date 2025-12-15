import express, { Request, Response } from "express";
import { registerSchema, loginSchema } from "../dtos/auth.dto";
import { signJwt } from "../utils/jwt";
import { AuthService } from "../services/auth.service";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();
const authService = new AuthService();

router.post("/register", async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });
  const { email, password, name } = parsed.data;
  try {
    const user = await authService.register(email, password, name);
    const token = signJwt({ id: user.id, email: user.email });
    res.cookie("token", token, { httpOnly: true });
    return res.status(201).json(user);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });
  const { email, password } = parsed.data;
  try {
    const user = await authService.login(email, password);
    const token = signJwt({ id: user.id, email: user.email });
    res.cookie("token", token, { httpOnly: true });
    return res.json(user);
  } catch (err: any) {
    return res.status(401).json({ error: err.message });
  }
});

router.get("/me", authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  try {
    const user = await authService.getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.get("/users", authMiddleware, async (req: Request, res: Response) => {
  try {
    const users = await authService.getAllUsers();
    return res.json(users);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

export default router;
