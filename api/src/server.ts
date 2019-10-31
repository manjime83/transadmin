import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { Context } from "apollo-server-core";
import jwt from "jsonwebtoken";
// import mongoose from "mongoose";

async function bootstrap(): Promise<void> {
  try {
    // await mongoose.connect(
    //   "mongodb+srv://admin:tfE0gL3OwLSJK5zi@cluster-zero-npfpe.mongodb.net/transadmin-test?retryWrites=true&w=majority",
    //   { useNewUrlParser: true, useUnifiedTopology: true }
    // );

    const schema = await buildSchema({
      resolvers: [__dirname + "/resolvers/**/*.ts"],
      authChecker: ({ context }, roles) => {
        return roles.includes(context.user.role);
      }
    });
    const server = new ApolloServer({
      schema,
      context: ({ req }): Context => {
        const token = (req.headers.authorization || "").split(" ")[1];
        try {
          return { user: jwt.verify(token, process.env.JWT_SECRET || "secret") };
        } catch (e) {
          return { user: undefined };
        }
      },
      cors: true
    });

    server.listen({ port: 4000 }, () => {
      console.log(`Server is running on http://localhost:4000${server.graphqlPath}`);
    });
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
