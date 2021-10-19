import { Field, ID, ObjectType } from '@nestjs/graphql';
import { OrganizerPartial } from 'src/organizers/models/organizer.partial.model';

@ObjectType()
export class Event {
    @Field(type => ID)
    id: number;

    @Field()
    title: string;

    @Field()
    description: string;

    @Field()
    date: Date;

    @Field()
    location: string;

    @Field()
    following: boolean;

    @Field()
    followers: number;

    @Field()
    organizer: OrganizerPartial;
}
