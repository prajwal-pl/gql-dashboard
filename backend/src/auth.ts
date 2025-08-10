import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { Request } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export function signToken(payload: { userId: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(
  token: string
): { userId: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}

export async function hashPassword(plain: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

export async function comparePassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export type Context = {
  user: null | {
    id: string;
    email: string;
    name: string;
    bio: string | null;
    role: string;
  };
  prisma: PrismaClient;
};

export async function buildContext(req: Request): Promise<Context> {
  const auth = req.headers["authorization"] || "";
  const token = auth.split(" ")[1];

  let user: Context["user"] = null;
  if (token) {
    const payload = verifyToken(token);
    if (payload?.userId) {
      const dbUser = await prisma.user.findUnique({
        where: { id: payload.userId },
      });
      if (dbUser) {
        user = {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          bio: dbUser.bio ?? null,
          role: dbUser.role,
        };
      }
    }
  }

  return { user, prisma };
}

export function requireAuth<T extends Context>(ctx: T) {
  if (!ctx.user) throw new Error("Unauthenticated");
  return ctx.user;
}

export function requireRole<T extends Context>(
  ctx: T,
  roles: Array<"TEACHER" | "STUDENT" | "ADMIN">
) {
  const u = requireAuth(ctx);
  if (!roles.includes(u.role as any)) throw new Error("Forbidden");
  return u;
}
