import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { NewOrganizerInput } from 'src/organizers/inputs/new-organizer.input';

@InputType()
export class NewUserInput {
    @Field()
    @IsEmail()
    email: string;

    @Field()
    @MaxLength(64)
    @IsNotEmpty()
    name: string;

    @Field()
    @IsNotEmpty()
    password: string;

    @Field({ nullable: true })
    organizer?: NewOrganizerInput;
}