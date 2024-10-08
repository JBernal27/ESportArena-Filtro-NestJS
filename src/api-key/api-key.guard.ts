import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const apiKey = request.headers['x-api-key'];
    console.log(apiKey);

    if (!apiKey) {
      throw new UnauthorizedException('x-api-key not found');
    }

    if (apiKey !== this.configService.get<string>('API_KEY')) {
      throw new UnauthorizedException('Verify the API KEY');
    }
    return true;
  }
}
