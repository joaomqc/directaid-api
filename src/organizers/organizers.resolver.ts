import { BadRequestException, NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NewOrganizerInput } from './inputs/new-organizer.input';
import { OrganizersArgs } from './inputs/organizers.args';
import { Organizer } from './models/organizer.model';
import { OrganizersService } from './organizers.service';
import { User } from 'src/users/models/user.model';
import { AuthGuard } from 'src/users/auth.guard';
import { OptionalAuthGuard } from 'src/users/optional-auth.guard';
import { FollowOrganizerInput } from './inputs/follow-organizer.input';


@Resolver(of => Organizer)
export class OrganizersResolver {
    constructor(private readonly organizersService: OrganizersService) { }

    @Query(returns => Organizer)
    @UseGuards(new OptionalAuthGuard())
    async organizer(
        @Args('id') id: number,
        @Context('user') user: User
    ): Promise<Organizer> {
        const organizer = await this.organizersService.findOneById(id, user?.id);
        if (!organizer) {
            throw new NotFoundException(id);
        }
        return organizer;
    }

    @Query(returns => [Organizer])
    @UseGuards(new OptionalAuthGuard())
    organizers(
        @Args() organizersArgs: OrganizersArgs,
        @Context('user') user: User
    ): Promise<Organizer[]> {
        if (organizersArgs.followingOnly && !user) {
            throw new BadRequestException();
        }

        return this.organizersService.findAll(organizersArgs, user?.id);
    }

    @Mutation(returns => Number)
    @UseGuards(new AuthGuard())
    async updateFollowOrganizer(
        @Args('followOrganizerData') followOrganizerData: FollowOrganizerInput,
        @Context('user') user: User
    ): Promise<number> {
        if (followOrganizerData.follow) {
            await this.organizersService.followOrganizer(user.id, followOrganizerData.organizerID);
        } else {
            await this.organizersService.unfollowOrganizer(user.id, followOrganizerData.organizerID);
        }

        return followOrganizerData.organizerID;
    }

    @Mutation(returns => Number)
    @UseGuards(new AuthGuard())
    async addOrganizer(
        @Args('newOrganizerData') newOrganizerData: NewOrganizerInput,
        @Context('user') user: User
    ): Promise<number> {
        const id = await this.organizersService.create(newOrganizerData, user.id);
        return id;
    }

    @Mutation(returns => Number)
    @UseGuards(new AuthGuard())
    async removeOrganizer(
        @Args('id') id: number,
        @Context('user') user: User
    ): Promise<number> {
        const organizer = await this.organizersService.findOneById(id);

        if (!organizer || organizer.user.id !== user.id) {
            throw new NotFoundException();
        }

        await this.organizersService.remove(id);
        return id;
    }
}