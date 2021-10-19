import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength } from 'class-validator';

@InputType()
export class NewEventInput {
    @Field()
    @MaxLength(64)
    title: string;

    @Field()
    @MaxLength(255)
    @IsNotEmpty()
    description: string;

    @Field()
    date: Date;

    @Field()
    @MaxLength(64)
    @IsNotEmpty()
    location: string;
}