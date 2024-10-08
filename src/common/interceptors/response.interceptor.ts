import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        const successCodes = [200, 201, 202, 204];

        if (successCodes.includes(statusCode)) {
          return {
            statusCode,
            message: 'Request completed successfully',
            data,
          };
        }

        return data;
      }),
    );
  }
}
