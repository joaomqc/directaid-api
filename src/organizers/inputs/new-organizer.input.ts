import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength } from 'class-validator';

@InputType()
export class NewOrganizerInput {
    @Field()
    @MaxLength(64)
    location: string;

    @Field()
    @MaxLength(255)
    @IsNotEmpty()
    description: string;
}