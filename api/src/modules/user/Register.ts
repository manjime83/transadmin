import { Resolver, Query, Mutation, Arg } from "type-graphql";
import bcrypt from "bcrypt";
import { User } from "../../entity/User";

@Resolver()
export class HelloResolver {
  @Query(() => String, { description: "Hola Mundo" })
  helloWorld(): string {
    return "Hola Mundo";
  }

  @Mutation(() => User)
  async register(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 16);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName
    }).save();

    return user;
  }
}
