import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class OrganizersArgs {
    @Field(type => Int)
    @Min(0)
    skip = 0;

    @Field(type => Int)
    @Min(1)
    @Max(50)
    take = 25;

    @Field(type => Boolean)
    followingOnly = false;

    @Field(type => String, { nullable: true })
    searchTerm = null;

    @Field(type => String, { nullable: true })
    sortBy = null;
}