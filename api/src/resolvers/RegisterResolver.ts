import { Resolver, Mutation, Query, Arg } from "type-graphql";
import jwt from "jsonwebtoken";

@Resolver()
export default class DriverResolver {
  @Mutation(() => String)
  async registerUser(@Arg("firstName") firstName: string, @Arg("lastName") lastName: string): Promise<string> {
    return firstName + " " + lastName;
  }

  @Query(() => String)
  login(@Arg("email") email: string, @Arg("password") password: string): string {
    if (password === "abcd1234") {
      return jwt.sign({ email }, process.env.JWT_SECRET || "s3cret");
    } else {
      throw new Error("bad passwprd");
    }
  }
}
