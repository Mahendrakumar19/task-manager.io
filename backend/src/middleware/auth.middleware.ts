import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token || req.headers["authorization"]?.toString().replace(/^Bearer /, "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const payload = verifyJwt(token);
    (req as any).user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
