import { Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class UpdateOrganizerInput {
    @Field({ nullable: true })
    @MaxLength(64)
    location?: string;

    @Field({ nullable: true })
    description?: string;
}