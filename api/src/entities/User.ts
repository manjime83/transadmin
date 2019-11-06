import { Entity, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { IsEmail, IsNotEmpty } from "class-validator";

@Entity({ name: "users", orderBy: { firstName: "ASC", lastName: "ASC" } })
@ObjectType()
export class User extends BaseEntity {
  @PrimaryColumn()
  @Field()
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({ name: "first_name" })
  @Field()
  @IsNotEmpty()
  firstName: string;

  @Column({ name: "last_name" })
  @Field()
  @IsNotEmpty()
  lastName: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
