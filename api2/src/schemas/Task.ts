import { Field, Int, ObjectType } from "type-graphql";
import Project from "./Project";

@ObjectType()
export default class Task {
  constructor() {
    this.id = 0;
    this.title = "";
    this.completed = false;
  }

  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field(() => Project)
  project: Project | undefined;

  @Field()
  completed: boolean;
}
