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
const server_1 = require("@apollo/server");
const express5_1 = require("@as-integrations/express5");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const schema_1 = require("./schema");
const resolvers_1 = require("./resolvers");
const auth_1 = require("./auth");
dotenv_1.default.config();
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const server = new server_1.ApolloServer({
            typeDefs: schema_1.typeDefs,
            resolvers: resolvers_1.resolvers,
        });
        yield server.start();
        app.use("/graphql", (0, cors_1.default)(), express_1.default.json(), (0, express5_1.expressMiddleware)(server, {
            context: (_a) => __awaiter(this, [_a], void 0, function* ({ req }) { return (0, auth_1.buildContext)(req); }),
        }));
        const port = process.env.PORT || 8000;
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}/graphql`);
        });
    });
}
startServer();
