import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from './entities/event.entity';
import { EventsArgs } from './inputs/events.args';
import { NewEventInput } from './inputs/new-event.input';
import { Event } from './models/event.model';

@Injectable()
export class EventsService {
    constructor(@InjectRepository(EventEntity) private eventRepository: Repository<EventEntity>) { }

    async create(data: NewEventInput, organizerID: number): Promise<number> {
        const id = (await this.eventRepository.insert({
            ...data,
            organizer: {
                id: organizerID
            }
        })).raw[0].id;

        return id;
    }

    async followEvent(userID: number, eventID: number): Promise<void> {
        await this.eventRepository
            .createQueryBuilder("event")
            .relation("usersFollowing")
            .of({id: eventID})
            .add({id: userID});
    }

    async unfollowEvent(userID: number, eventID: number): Promise<void> {
        await this.eventRepository
            .createQueryBuilder("event")
            .relation("usersFollowing")
            .of({id: eventID})
            .remove({id: userID});
    }

    async findOneById(id: number, userID?: number): Promise<Event> {
        const event: any = await this.eventRepository
            .createQueryBuilder("event")
            .innerJoinAndSelect("event.organizer", "organizer")
            .leftJoinAndMapOne("event.user", "event.usersFollowing", "user", "user.id = :userID", { userID: userID })
            .loadRelationCountAndMap("event.followers", "event.usersFollowing")
            .where("event.id = :eventID", { eventID: id })
            .select(["event.id", "event.title", "event.description", "event.date", "event.location", "organizer.id", "organizer.name", "user.id"])
            .getOne();

        if (!event) {
            return null;
        }

        return {
            ...event,
            following: !!event.user,
            followers: event.followers,
            organizer: event.organizer
        }
    }

    async findAll(eventsArgs: EventsArgs, userID?: number): Promise<Event[]> {
        let query = await this.eventRepository
            .createQueryBuilder("event");

        if (!!eventsArgs.organizer?.id) {
            query = query
                .innerJoinAndSelect("event.organizer", "organizer", "organizer.id = :organizerID", { organizerID: eventsArgs.organizer.id });
        } else {
            query = query
                .innerJoinAndSelect("event.organizer", "organizer")
        }

        if (eventsArgs.followingOnly && !!userID) {
            query = query
                .innerJoinAndMapOne("event.user", "event.usersFollowing", "user", "user.id = :userID", { userID: userID })
        } else {
            query = query
                .leftJoinAndMapOne("event.user", "event.usersFollowing", "user", "user.id = :userID", { userID: userID })
        }

        if (!!eventsArgs.searchTerm) {
            query = query
                .where("event.title ilike :searchTerm", { searchTerm: `%${eventsArgs.searchTerm}%` });
        }

        if (!!eventsArgs.sortBy) {
            query = query
                .orderBy("event." + eventsArgs.sortBy);
        }

        query = query
            .loadRelationCountAndMap("event.followers", "event.usersFollowing")
            .skip(eventsArgs.skip)
            .take(eventsArgs.take)
            .select(["event.id", "event.title", "event.description", "event.date", "event.location", "organizer.id", "organizer.name", "user.id"]);
        
        const events: any[] = await query.getMany();

        return events.map(event => ({
            ...event,
            following: !!event.user,
            followers: event.followers,
            organizer: event.organizer
        }));
    }

    async remove(id: number): Promise<void> {
        await this.eventRepository.delete(id);
    }
}