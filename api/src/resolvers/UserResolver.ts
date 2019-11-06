import { Resolver, Mutation, Query, Arg, InputType, Field } from "type-graphql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { validate } from "class-validator";
import { ApolloError, UserInputError } from "apollo-server";

@InputType()
export class UserData {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;
}

@Resolver()
export default class UserResolver {
  @Mutation(() => User)
  async createUser(@Arg("input") input: UserData): Promise<User> {
    const { email, password, firstName, lastName } = input;

    const encryptedPassword = await bcrypt.hash(password, 13);
    const user = User.create({ email, password: encryptedPassword, firstName, lastName });

    const errors = await validate(user);
    if (errors.length > 0) {
      throw new UserInputError("Object validation error", {
        invalidArgs: errors.reduce(
          (result, { property, constraints }) => {
            result[property] = Object.values(constraints).join(", ");
            return result;
          },
          {} as Record<string, string>
        )
      });
    }

    const count = await User.count({ email });
    if (count > 0) {
      throw new ApolloError("El usuario ya existe");
    }

    return await user.save();
  }

  @Query(() => String)
  async login(@Arg("email") email: string, @Arg("password") password: string): Promise<string> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new ApolloError("user not found");
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new ApolloError("bad password");
    }

    return jwt.sign({ email, role: "USER" }, process.env.JWT_SECRET || "s3cret", {
      expiresIn: "1h",
      issuer: "transadmin.co"
    });
  }
}
