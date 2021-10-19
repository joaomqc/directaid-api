import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserPartial } from 'src/users/models/user.partial.model';

@ObjectType()
export class Organizer {
    @Field(type => ID)
    id: number;

    @Field()
    location: string;

    @Field()
    description: string;

    @Field()
    user: UserPartial;
}
