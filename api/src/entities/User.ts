import { Entity, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from "typeorm";
import { ObjectType, Field } from "type-graphql";

@Entity({ name: "users", orderBy: { firstName: "ASC", lastName: "ASC" } })
@ObjectType()
export class User extends BaseEntity {
  @PrimaryColumn()
  @Field()
  email: string;

  @Column()
  password: string;

  @Column({ name: "first_name" })
  @Field()
  firstName: string;

  @Column({ name: "last_name" })
  @Field()
  lastName: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
