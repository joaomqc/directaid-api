import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FollowOrganizerInput {
    @Field()
    organizerID: number;

    @Field()
    follow: boolean;
}