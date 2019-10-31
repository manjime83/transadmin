import { Resolver, Mutation, Arg } from "type-graphql";

// @ObjectType("Driver")
// class DriverType {
//   constructor() {
//     this.id = "";
//     this.firstName = "";
//     this.lastName = "";
//   }

//   @Field(() => ID)
//   id: string;

//   @Field()
//   firstName: string;

//   @Field()
//   lastName: string;
// }

@Resolver()
export default class DriverResolver {
  @Mutation(() => String)
  async createDriver(@Arg("firstName") firstName: string, @Arg("lastName") lastName: string): Promise<string> {
    return firstName + " " + lastName;
  }
}
