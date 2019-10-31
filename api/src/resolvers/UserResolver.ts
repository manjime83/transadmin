import { Resolver, Mutation, ID, Field, Arg, InputType, Query } from "type-graphql";
import User from "../schemas/User";
import bcrypt from "bcrypt";

@InputType()
class CreateUserInput {
  @Field(() => ID)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;
}

const data: User[] = [];

@Resolver(User)
export default class UserResolver {
  @Mutation(() => User)
  async createUser(@Arg("input") input: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(input.password, 13);

    const user: User = { ...input, password: hashedPassword };

    data.push(user);
    return user;
  }

  @Query(() => [User], { nullable: true })
  getUsers(): User[] {
    // console.log(ctx);
    return data;
  }
}
