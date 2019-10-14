import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { Resolver, Query, buildSchema } from "type-graphql";

@Resolver()
class HelloResolver {
  @Query(() => String, { description: "Hola Mundo" })
  async hello(): Promise<number> {
    return await this.numberOne();
  }

  async numberOne(): Promise<number> {
    return Promise.resolve(1);
  }
}

const bootstrap = async (): Promise<void> => {
  const schema = await buildSchema({ resolvers: [HelloResolver] });
  const apolloServer = new ApolloServer({
    schema,
    playground: process.env.NODE_ENV !== "production"
  });

  apolloServer.listen().then(({ url, subscriptionsPath }) => {
    console.log(
      `Server ready at ${url.concat(subscriptionsPath.substring(1))}`
    );
  });
};

bootstrap();
