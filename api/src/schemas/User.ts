import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export default class User {
  @Field(() => ID)
  email: string;

  password: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;
}
