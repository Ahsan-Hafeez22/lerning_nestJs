import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Role } from '../../user/user.types';

export interface JwtUser {
  sub: string;
  email?: string;
  role?: Role;
}

interface RequestWithUser extends Request {
  user: JwtUser;
}

export const CurrentUser = createParamDecorator(
  (data: keyof JwtUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    return data ? user[data] : user;
  },
);
