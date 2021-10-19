import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizerEntity } from './entities/organizer.entity';
import { OrganizersResolver } from './organizers.resolver';
import { OrganizersService } from './organizers.service';

@Module({
    imports: [TypeOrmModule.forFeature([OrganizerEntity])],
    providers: [OrganizersResolver, OrganizersService],
    exports: [OrganizersService]
})
export class OrganizersModule { }