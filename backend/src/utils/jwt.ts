import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "changeme";

export function signJwt(payload: object, expiresIn = "7d") {
  return jwt.sign(payload, SECRET, { expiresIn });
}

export function verifyJwt<T = any>(token: string): T {
  return jwt.verify(token, SECRET) as T;
}
