import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { typeDefs } from "./schema";

dotenv.config();

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs: typeDefs,
  });

  await server.start();

  app.use("/graphql", cors(), express.json(), expressMiddleware(server));

  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/graphql`);
  });
}

startServer();
