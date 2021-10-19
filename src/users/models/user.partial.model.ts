import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserPartial {
    @Field(type => ID)
    id: number;

    @Field()
    name: string;
}
