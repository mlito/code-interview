import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { User } from '../../modules/users/entities/Users.entity';
import { UserService } from '../../modules/users/services/user.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly _reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this._reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!permissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = <User>request.user;
    return this.userService.userHasPermissionOrRoleBound(user.id, permissions);
  }
}
