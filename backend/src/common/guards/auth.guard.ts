import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    
    console.log('🔐 Validating auth token...');
    
    if (!token) {
      throw new UnauthorizedException('Token missing');
    }
    
    // Simulation validation token
    return true;
  }
}