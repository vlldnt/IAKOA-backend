import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  handleRequest(err: any, user: any, info: any) {
    // Si pas d'utilisateur ou erreur, lever une exception avec message personnalisé
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Votre refresh token a expiré. Veuillez vous reconnecter.');
      }
      if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Refresh token invalide. Veuillez vous reconnecter.');
      }
      throw new UnauthorizedException('Token de rafraîchissement invalide ou expiré.');
    }
    return user;
  }
}
