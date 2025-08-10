import { PrismaClient } from "../generated/prisma";
import {
  comparePassword,
  hashPassword,
  requireAuth,
  requireRole,
  signToken,
} from "./auth";

const prisma = new PrismaClient();

export const resolvers = {
  DateTime: {
    __parseValue(value: any) {
      return new Date(value);
    },
    __serialize(value: any) {
      return new Date(value).toISOString();
    },
    __parseLiteral(ast: any) {
      return ast.kind === "StringValue" ? new Date(ast.value) : null;
    },
  },
  Query: {
    me: async (_: any, __: any, ctx: any) => {
      if (!ctx.user) return null;
      const u = await prisma.user.findUnique({ where: { id: ctx.user.id } });
      return u;
    },
    dashboardStats: async (_: any, __: any, ctx: any) => {
      requireRole(ctx, ["TEACHER", "ADMIN"]);
      // Minimal stats using users collection
      const [totalUsers, totalTeachers, totalStudents] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: "TEACHER" } as any }),
        prisma.user.count({ where: { role: "STUDENT" } as any }),
      ]);
      return { totalUsers, totalTeachers, totalStudents };
    },
  },
  Mutation: {
    register: async (_: any, { input }: any) => {
      const { email, name, password, role, bio } = input;
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) throw new Error("Email already registered");

      const passwordHash = await hashPassword(password);
      const user = await prisma.user.create({
        data: { email, name, password: passwordHash, role, bio },
      });
      const token = signToken({ userId: user.id, role: user.role });
      return { token, user };
    },
    login: async (_: any, { input }: any) => {
      const { email, password } = input;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("Invalid credentials");
      const ok = await comparePassword(password, user.password);
      if (!ok) throw new Error("Invalid credentials");
      const token = signToken({ userId: user.id, role: user.role });
      return { token, user };
    },
    updateProfile: async (_: any, { input }: any, ctx: any) => {
      const u = requireAuth(ctx);
      if (input.email) {
        const exists = await prisma.user.findUnique({
          where: { email: input.email },
        });
        if (exists && exists.id !== u.id)
          throw new Error("Email already in use");
      }
      const updated = await prisma.user.update({
        where: { id: u.id },
        data: {
          name: input.name ?? undefined,
          bio: input.bio ?? undefined,
          email: input.email ?? undefined,
        },
      });
      return updated;
    },
    changePassword: async (
      _: any,
      { currentPassword, newPassword }: any,
      ctx: any
    ) => {
      const u = requireAuth(ctx);
      const user = await prisma.user.findUnique({ where: { id: u.id } });
      if (!user) throw new Error("User not found");
      const ok = await comparePassword(currentPassword, user.password);
      if (!ok) throw new Error("Current password is incorrect");
      const newHash = await hashPassword(newPassword);
      await prisma.user.update({
        where: { id: u.id },
        data: { password: newHash },
      });
      return true;
    },
  },
};
