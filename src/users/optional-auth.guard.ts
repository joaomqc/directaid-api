import { ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";

export class OptionalAuthGuard extends AuthGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try{
            super.canActivate(context)
        }catch(err){

        }

        return true;
    }
}