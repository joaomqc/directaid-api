import { BadRequestException, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NewEventInput } from './inputs/new-event.input';
import { EventsArgs } from './inputs/events.args';
import { Event } from './models/event.model';
import { EventsService } from './events.service';
import { User } from 'src/users/models/user.model';
import { AuthGuard } from 'src/users/auth.guard';
import { OptionalAuthGuard } from 'src/users/optional-auth.guard';
import { FollowEventInput } from './inputs/follow-event.input';


@Resolver(of => Event)
export class EventsResolver {
    constructor(private readonly eventsService: EventsService) { }

    @Query(returns => Event)
    @UseGuards(new OptionalAuthGuard())
    async event(
        @Args('id') id: number,
        @Context('user') user: User
    ): Promise<Event> {
        const event = await this.eventsService.findOneById(id, user?.id);
        if (!event) {
            throw new NotFoundException(id);
        }
        return event;
    }

    @Query(returns => [Event])
    @UseGuards(new OptionalAuthGuard())
    events(
        @Args() eventsArgs: EventsArgs,
        @Context('user') user: User
    ): Promise<Event[]> {
        if (eventsArgs.followingOnly && !user) {
            throw new BadRequestException();
        }

        return this.eventsService.findAll(eventsArgs, user?.id);
    }

    @Mutation(returns => Number)
    @UseGuards(new AuthGuard())
    async updateFollowEvent(
        @Args('followEventData') followEventData: FollowEventInput,
        @Context('user') user: User
    ): Promise<number> {
        if (followEventData.follow) {
            await this.eventsService.followEvent(user.id, followEventData.eventID);
        } else {
            await this.eventsService.unfollowEvent(user.id, followEventData.eventID);
        }

        return followEventData.eventID;
    }

    @Mutation(returns => Number)
    @UseGuards(new AuthGuard())
    async addEvent(
        @Args('newEventData') newEventData: NewEventInput,
        @Context('user') user: User
    ): Promise<number> {
        if (!user.organizer) {
            throw new UnauthorizedException();
        }

        const id = await this.eventsService.create(newEventData, user.organizer.id);
        return id;
    }

    @Mutation(returns => Number)
    @UseGuards(new AuthGuard())
    async removeEvent(
        @Args('id') id: number,
        @Context('user') user: User
    ): Promise<number> {
        if (!user.organizer) {
            throw new UnauthorizedException();
        }

        const event = await this.eventsService.findOneById(id);

        if (!event || event.organizer.id !== user.organizer.id) {
            throw new NotFoundException();
        }

        await this.eventsService.remove(id);
        return id;
    }
}