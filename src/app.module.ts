import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { EventsModule } from './events/events.module';
import { OrganizersModule } from './organizers/organizers.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        EventsModule,
        UsersModule,
        OrganizersModule,
        GraphQLModule.forRoot({
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            context: ({ req }) => ({ headers: req.headers }),
            buildSchemaOptions: {
                numberScalarMode: 'integer'
            }
        }),
        TypeOrmModule.forRoot()
    ]
})
export class AppModule { }
