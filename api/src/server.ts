import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import jwt from "jsonwebtoken";

async function bootstrap(): Promise<void> {
  try {
    createConnection();



    const schema = await buildSchema({
      resolvers: [__dirname + "/resolvers/**/*.ts"],
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
      context: ({ req }) => {
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
    app.use(express.static(__dirname + '/public'));

    server.applyMiddleware({ app });

    app.listen({ port: 4000 }, () => {
      console.log(`Server is running on http://localhost:4000${server.graphqlPath}`);
    });
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
