import { BadRequestException, NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrganizersService } from 'src/organizers/organizers.service';
import { AuthGuard } from './auth.guard';
import { LoginInput } from './inputs/login.input';
import { NewUserInput } from './inputs/new-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { User } from './models/user.model';
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
    constructor(
        private readonly usersService: UsersService,
        private readonly organizersService: OrganizersService
    ) { }

    @Query(returns => User)
    @UseGuards(new AuthGuard())
    async me(@Context('user') user: User) {
        const userInfo = await this.usersService.findOneById(user.id);
        if (!userInfo) {
            throw new NotFoundException(user.id);
        }
        return userInfo;
    }

    @Mutation(returns => User)
    @UseGuards(new AuthGuard())
    async updateUser(
        @Context('user') user: User,
        @Args('updateUserData') updateUserData: UpdateUserInput
    ) {
        const userInfo = await this.usersService.update(user.id, updateUserData);
        if (!userInfo) {
            throw new NotFoundException(user.id);
        }
        return userInfo;
    }

    @Mutation(returns => String)
    async login(
        @Args('loginData') loginData: LoginInput,
    ): Promise<string> {
        const token = await this.usersService.login(loginData.email, loginData.password);

        if (!token) {
            throw new BadRequestException();
        }

        return token;
    }

    @Mutation(returns => Number)
    async addUser(
        @Args('newUserData') newUserData: NewUserInput,
    ): Promise<number> {
        const { organizer, ...userData } = newUserData;

        const userID = await this.usersService.create(userData);

        if (!!organizer) {
            await this.organizersService.create(organizer, userID);
        }

        return userID;
    }

    @Mutation(returns => Number)
    @UseGuards(new AuthGuard())
    async removeUser(
        @Context('user') user: User
    ): Promise<number> {
        await this.usersService.remove(user.id);
        return user.id;
    }
}