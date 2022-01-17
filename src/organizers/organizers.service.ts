import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizerEntity } from './entities/organizer.entity';
import { OrganizersArgs } from './inputs/organizers.args';
import { NewOrganizerInput } from './inputs/new-organizer.input';
import { Organizer } from './models/organizer.model';

@Injectable()
export class OrganizersService {
    constructor(@InjectRepository(OrganizerEntity) private organizerRepository: Repository<OrganizerEntity>) { }

    async create(data: NewOrganizerInput, userID: number): Promise<number> {
        const id = (await this.organizerRepository.insert({
            ...data,
            user: { id: userID }
        })).raw[0].id;

        return id;
    }

    async followOrganizer(userID: number, organizerID: number): Promise<void> {
        await this.organizerRepository
            .createQueryBuilder("organizer")
            .relation("usersFollowing")
            .of({ id: organizerID })
            .add({ id: userID });
    }

    async unfollowOrganizer(userID: number, organizerID: number): Promise<void> {
        await this.organizerRepository
            .createQueryBuilder("organizer")
            .relation("usersFollowing")
            .of({ id: organizerID })
            .remove({ id: userID });
    }

    async findOneById(id: number, userID?: number): Promise<Organizer> {
        const organizer: any = await this.organizerRepository
            .createQueryBuilder("organizer")
            .innerJoinAndSelect("organizer.user", "user")
            .leftJoinAndMapOne("organizer.userFollowing", "organizer.usersFollowing", "user", "user.id = :userID", { userID: userID })
            .loadRelationCountAndMap("organizer.followers", "organizer.usersFollowing")
            .where("organizer.id = :organizerID", { organizerID: id })
            .select(["organizer.id", "organizer.location", "organizer.description", "user.id", "user.name", "user.creationDate"])
            .getOne();

        if (!organizer) {
            return null;
        }
        return this.toModel(organizer);
    }

    async findAll(organizersArgs: OrganizersArgs, userID?: number): Promise<Organizer[]> {
        let query = await this.organizerRepository
            .createQueryBuilder("organizer")
            .innerJoinAndSelect("organizer.user", "user");

        if (organizersArgs.followingOnly && !!userID) {
            query = query
                .addSelect(qb => qb
                    .from("organizer", "organizer")
                    .innerJoinAndMapOne("organizer.userFollowing", "organizer.usersFollowing", "user", "user.id = :userID", { userID: userID }))
        } else {
            query = query
                .addSelect(qb => qb
                    .from("organizer", "organizer")
                    .leftJoinAndMapOne("organizer.userFollowing", "organizer.usersFollowing", "user", "user.id = :userID", { userID: userID }))
        }

        if (!!organizersArgs.searchTerm) {
            query = query
                .where("organizer.name ilike :searchTerm", { searchTerm: `%${organizersArgs.searchTerm}%` });
        }

        if (!!organizersArgs.sortBy) {
            switch (organizersArgs.sortBy) {
                case "name":
                    query = query
                        .orderBy("user." + organizersArgs.sortBy);
                    break
                default:
                    query = query
                        .orderBy("organizer." + organizersArgs.sortBy);
            }
        }

        query = query
            .loadRelationCountAndMap("organizer.followers", "organizer.usersFollowing")
            .skip(organizersArgs.skip)
            .take(organizersArgs.take)
            .select(["organizer.id", "organizer.location", "organizer.description", "user.id", "user.name", "user.creationDate"]);

        const organizers: any[] = await query.getMany();

        return organizers.map(this.toModel);
    }

    async remove(id: number): Promise<void> {
        await this.organizerRepository.delete(id);
    }

    private toModel(organizer: any): Organizer {
        return {
            ...organizer,
            following: !!organizer.userFollowing,
            followers: organizer.followers,
            name: organizer.user.name,
            userId: organizer.user.id,
            creationDate: organizer.user.creationDate
        }
    }
}