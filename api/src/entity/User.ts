import { ObjectID } from "mongodb";
import { Entity, ObjectIdColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity({ name: "users" })
export class User extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  _id: ObjectID | undefined;

  @Field()
  @Column({ unique: true })
  email: string = "";

  @Column()
  password: string = "";

  @Field()
  @Column()
  firstName: string = "";

  @Field()
  @Column()
  lastName: string = "";

  @Field()
  fullName: string = "";
}
