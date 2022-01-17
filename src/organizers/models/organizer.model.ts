import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Organizer {
    @Field(type => ID)
    id: number;

    @Field()
    location: string;

    @Field()
    description: string;

    @Field()
    userId: number;

    @Field()
    name: string;

    @Field()
    creationDate: Date;

    @Field()
    followers: number;

    @Field()
    following: boolean;
}
