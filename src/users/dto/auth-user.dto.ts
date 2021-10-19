import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthUser {
    @Field(type => ID)
    id: number;

    @Field()
    email: string;

    @Field()
    password: string;
}
