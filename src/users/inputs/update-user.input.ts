import { Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { UpdateOrganizerInput } from 'src/organizers/inputs/update-organizer.input';

@InputType()
export class UpdateUserInput {
    @Field({ nullable: true })
    @MaxLength(64)
    name?: string;

    @Field({ nullable: true })
    password?: string;

    @Field({ nullable: true })
    organizer?: UpdateOrganizerInput;
}