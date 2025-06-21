import { Role } from '../../../core/models/role';

export interface Account {
  role: Role;
  name: string;
  email: string;
  phone: string;
}
