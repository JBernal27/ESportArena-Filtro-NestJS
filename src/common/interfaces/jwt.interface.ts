import { roles } from '../enums/roles.enum';

export interface userJWT {
  id: number;
  name: string;
  email: string;
  role: roles;
}
