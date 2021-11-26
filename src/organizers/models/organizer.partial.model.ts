import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class OrganizerPartial {
    @Field(type => ID)
    id: number;

    @Field()
    name: string;

    @Field()
    location: string;

    @Field()
    description: string;
}
