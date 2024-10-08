import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

export function PrivateService() {
  return applyDecorators(UseGuards(AuthGuard), ApiBearerAuth('access-token'));
}
