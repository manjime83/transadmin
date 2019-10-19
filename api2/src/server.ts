import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";

import ProjectResolver from "./resolvers/ProjectResolver";
import TaskResolver from "./resolvers/TaskResolver";

async function bootstrap(): Promise<void> {
  buildSchema({
    resolvers: [ProjectResolver, TaskResolver],
    emitSchemaFile: true
  })
    .then(schema => {
      const server = new ApolloServer({ schema, debug: false });

      server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
    })
    .catch(error => console.log(error));
}

bootstrap();
