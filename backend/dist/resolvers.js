"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const prisma_1 = require("../generated/prisma");
const auth_1 = require("./auth");
const prisma = new prisma_1.PrismaClient();
exports.resolvers = {
    DateTime: {
        __parseValue(value) { return new Date(value); },
        __serialize(value) { return new Date(value).toISOString(); },
        __parseLiteral(ast) { return (ast.kind === 'StringValue') ? new Date(ast.value) : null; },
    },
    Query: {
        me: (_, __, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            if (!ctx.user)
                return null;
            const u = yield prisma.user.findUnique({ where: { id: ctx.user.id } });
            return u;
        }),
        dashboardStats: (_, __, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            (0, auth_1.requireRole)(ctx, ["TEACHER", "ADMIN"]);
            // Minimal stats using users collection
            const [totalUsers, totalTeachers, totalStudents] = yield Promise.all([
                prisma.user.count(),
                prisma.user.count({ where: { role: "TEACHER" } }),
                prisma.user.count({ where: { role: "STUDENT" } }),
            ]);
            return { totalUsers, totalTeachers, totalStudents };
        }),
    },
    Mutation: {
        register: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { input }) {
            const { email, name, password, role, bio } = input;
            const existing = yield prisma.user.findUnique({ where: { email } });
            if (existing)
                throw new Error("Email already registered");
            const passwordHash = yield (0, auth_1.hashPassword)(password);
            const user = yield prisma.user.create({
                data: { email, name, password: passwordHash, role, bio },
            });
            const token = (0, auth_1.signToken)({ userId: user.id, role: user.role });
            return { token, user };
        }),
        login: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { input }) {
            const { email, password } = input;
            const user = yield prisma.user.findUnique({ where: { email } });
            if (!user)
                throw new Error("Invalid credentials");
            const ok = yield (0, auth_1.comparePassword)(password, user.password);
            if (!ok)
                throw new Error("Invalid credentials");
            const token = (0, auth_1.signToken)({ userId: user.id, role: user.role });
            return { token, user };
        }),
        updateProfile: (_1, _a, ctx_1) => __awaiter(void 0, [_1, _a, ctx_1], void 0, function* (_, { input }, ctx) {
            var _b, _c, _d;
            const u = (0, auth_1.requireAuth)(ctx);
            if (input.email) {
                const exists = yield prisma.user.findUnique({ where: { email: input.email } });
                if (exists && exists.id !== u.id)
                    throw new Error("Email already in use");
            }
            const updated = yield prisma.user.update({
                where: { id: u.id },
                data: {
                    name: (_b = input.name) !== null && _b !== void 0 ? _b : undefined,
                    bio: (_c = input.bio) !== null && _c !== void 0 ? _c : undefined,
                    email: (_d = input.email) !== null && _d !== void 0 ? _d : undefined,
                },
            });
            return updated;
        }),
        changePassword: (_1, _a, ctx_1) => __awaiter(void 0, [_1, _a, ctx_1], void 0, function* (_, { currentPassword, newPassword }, ctx) {
            const u = (0, auth_1.requireAuth)(ctx);
            const user = yield prisma.user.findUnique({ where: { id: u.id } });
            if (!user)
                throw new Error("User not found");
            const ok = yield (0, auth_1.comparePassword)(currentPassword, user.password);
            if (!ok)
                throw new Error("Current password is incorrect");
            const newHash = yield (0, auth_1.hashPassword)(newPassword);
            yield prisma.user.update({ where: { id: u.id }, data: { password: newHash } });
            return true;
        }),
    },
};
