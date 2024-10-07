import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { roles } from 'src/common/enums/roles.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'jose bernal' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'josebernal@correo.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'josebernal12345' })
  @IsString()
  password: string;

  @ApiProperty({
    example: roles.ADMIN,
    enum: roles,
    description:
      'The role of the user. Possible values: admin, user, superadmin',
  })
  @IsEnum(roles)
  role: roles;
}
