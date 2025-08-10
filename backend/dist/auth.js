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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.verifyToken = verifyToken;
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.buildContext = buildContext;
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
function signToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (_a) {
        return null;
    }
}
function hashPassword(plain) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcryptjs_1.default.genSalt(10);
        return bcryptjs_1.default.hash(plain, salt);
    });
}
function comparePassword(plain, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcryptjs_1.default.compare(plain, hash);
    });
}
function buildContext(req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const auth = req.headers["authorization"] || "";
        const token = typeof auth === "string" && auth.startsWith("Bearer ") ? auth.slice(7) : undefined;
        let user = null;
        if (token) {
            const payload = verifyToken(token);
            if (payload === null || payload === void 0 ? void 0 : payload.userId) {
                const dbUser = yield prisma.user.findUnique({ where: { id: payload.userId } });
                if (dbUser) {
                    user = {
                        id: dbUser.id,
                        email: dbUser.email,
                        name: dbUser.name,
                        bio: (_a = dbUser.bio) !== null && _a !== void 0 ? _a : null,
                        role: dbUser.role,
                    };
                }
            }
        }
        return { user, prisma };
    });
}
function requireAuth(ctx) {
    if (!ctx.user)
        throw new Error("Unauthenticated");
    return ctx.user;
}
function requireRole(ctx, roles) {
    const u = requireAuth(ctx);
    if (!roles.includes(u.role))
        throw new Error("Forbidden");
    return u;
}
