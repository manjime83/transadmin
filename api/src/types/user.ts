import { ObjectType, Field } from "type-graphql";
import { GraphQLString, GraphQLBoolean } from "graphql";

@ObjectType()
class User {
  @Field(() => GraphQLString)
  name = "";

  @Field(type => {
    console.log(type);
    return GraphQLBoolean;
  })
  isOld = false;
}
