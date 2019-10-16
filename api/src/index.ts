import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { HelloResolver } from "./modules/user/Register";

const bootstrap = async (): Promise<void> => {
  await createConnection();

  const schema = await buildSchema({ resolvers: [HelloResolver] });
  const apolloServer = new ApolloServer({
    schema
  });

  apolloServer.listen().then(({ url, subscriptionsPath }) => {
    console.log(
      `Server ready at ${url.concat(subscriptionsPath.substring(1))}`
    );
  });
};

bootstrap();
