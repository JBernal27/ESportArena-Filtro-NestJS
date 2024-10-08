import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { userJWT } from 'src/common/interfaces/jwt.interface';
import { LoginDto } from './dto/login.dto';
import { PrivateService } from 'src/common/decorators/auth.decorator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @PrivateService()
  @Post('validate')
  @ApiOperation({ summary: 'Validate user JWT' })
  @ApiResponse({ status: 200, description: 'User validated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  validate(@Request() req) {
    const user = req.user as userJWT;
    return user;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    description: 'Login user with email and password',
    type: LoginDto,
  })
  async signIn(@Body() { email, password }: LoginDto) {
    return this.authService.login({
      email,
      password,
    });
  }
}
