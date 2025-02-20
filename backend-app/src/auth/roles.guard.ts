import { Injectable, ExecutionContext, Logger, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from 'src/users/role.enum';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Checks if the user has the required roles and if the JWT token is valid.
   * @param context The execution context for the request.
   * @returns Boolean indicating if the user can access the resource.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = (await super.canActivate(context)) as boolean;
    if (!canActivate) {
      this.logger.warn('Unauthorized access attempt due to invalid JWT token');
      return false;
    }

    const roles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
    if (!roles) {
      this.logger.debug('No roles required for this route, allowing access');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      this.logger.warn('User not found in request object');
      throw new ForbiddenException('User not found');
    }

    const hasRole = roles.includes(user.role);
    if (!hasRole) {
      this.logger.warn(`User with role ${user.role} is not authorized`);
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    this.logger.debug(`User with role ${user.role} has access`);
    return true;
  }
}
