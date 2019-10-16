import { Resolver, Query } from "type-graphql";
import { GraphQLString } from "graphql";

@Resolver()
class HelloResolver {
  @Query(() => GraphQLString, { description: "Hola Mundo" })
  hello(): number {
    return 123;
  }
}
