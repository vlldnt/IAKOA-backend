import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const paramId = request.params.id || request.params.userId;

    if (!user) {
      throw new ForbiddenException('Utilisateur non authentifié');
    }

    if (user.role === Role.ADMIN) {
      return true;
    }

    if (paramId && user.id !== paramId) {
      throw new ForbiddenException("Vous ne pouvez accéder qu'à vos propres ressources");
    }

    return true;
  }
}
