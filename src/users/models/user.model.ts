import { Field, ID, ObjectType } from '@nestjs/graphql';
import { OrganizerPartial } from 'src/organizers/models/organizer.partial.model';

@ObjectType()
export class User {
    @Field(type => ID)
    id: number;

    @Field()
    email: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    organizer?: OrganizerPartial;
}
