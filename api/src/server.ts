import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import jwt from "jsonwebtoken";
import path from "path";
import https from "https";
import fs from "fs";
import cors from "cors";

async function bootstrap(): Promise<void> {
  try {
    createConnection();

    const schema = await buildSchema({
      resolvers: [path.join(__dirname, "/resolvers/**/*.ts")],
      authChecker: ({ context }, roles) => {
        if (context.user) {
          return roles.includes(context.user.role);
        } else {
          return false;
        }
      }
    });

    const server = new ApolloServer({
      schema,
      context: ({ req }): any => {
        const token = (req.headers.authorization || "").split(" ")[1];
        try {
          return { user: jwt.verify(token, process.env.JWT_SECRET || "s3cret") };
        } catch (error) {
          return { user: undefined };
        }
      },
      debug: false
    });

    const app = express();

    app.use(cors());

    server.applyMiddleware({ app });

    app.use(express.static(path.join(__dirname, "..", "public")));

    app.get("*", (_, res) => {
      res.sendFile(path.join(__dirname, "..", "public", "index.html"));
    });

    const options = {
      key: fs.readFileSync(path.join(__dirname, "..", "cert", "key.pem")),
      cert: fs.readFileSync(path.join(__dirname, "..", "cert", "cert.pem")),
      passphrase: process.env.HTTPS_PASSPHRASE || "s3cret"
    };

    https.createServer(options, app).listen({ port: process.env.PORT || 8443 }, () => {
      console.log(`Server is running on https://localhost:8443${server.graphqlPath}`);
    });
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
