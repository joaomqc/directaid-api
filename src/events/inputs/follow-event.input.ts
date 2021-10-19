import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FollowEventInput {
    @Field()
    eventID: number;

    @Field()
    follow: boolean;
}