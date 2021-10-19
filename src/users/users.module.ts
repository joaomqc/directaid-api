import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizerEntity } from 'src/organizers/entities/organizer.entity';
import { OrganizersService } from 'src/organizers/organizers.service';
import { UserEntity } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, OrganizerEntity])],
    providers: [UsersResolver, UsersService, OrganizersService]
})
export class UsersModule { }