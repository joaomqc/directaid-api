import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import jwt from "jsonwebtoken";
import config from '../../jwt.json';

@Injectable()
export class AuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const graphqlContext = GqlExecutionContext.create(context).getContext();

        if (!graphqlContext.headers.authorization) {
            return false;
        }

        const user = await this.validateToken(graphqlContext.headers.authorization);

        if(!user){
            return false;
        }

        graphqlContext.user = user;

        return true;
    }

    async validateToken(authHeader: string): Promise<string | jwt.JwtPayload> {
        const authHeaderSplit = authHeader.split(' ');

        if (authHeaderSplit[0] !== 'Bearer') {
            return null;
        }

        const token = authHeaderSplit[1];

        try {
            return jwt.verify(token, config.secret);
        } catch (err) {
            return null;
        }
    }
}