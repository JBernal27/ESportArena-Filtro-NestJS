import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { userJWT } from 'src/common/interfaces/jwt.interface';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    try {
      const user: User = await this.usersService.findOneByEmail(email);

      if (!user || user.is_deleted) {
        throw new NotFoundException(
          'User not found, Verify your credentials or contact your administrator to register',
        );
      }
      const isMatch = await bcrypt.compare(pass, user?.password);
      if (!isMatch) {
        throw new NotFoundException(
          'User not found, Verify your credentials or contact your administrator to register',
        );
      }
      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  }

  async login(user: Partial<User>) {
    try {
      const verifiedUser = await this.validateUser(user.email, user.password);

      const payload: userJWT = {
        id: verifiedUser.id,
        name: verifiedUser.name,
        email: verifiedUser.email,
        role: verifiedUser.role,
      };
      return {
        token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw error;
    }
  }
}
