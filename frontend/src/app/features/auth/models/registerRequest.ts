import { Address } from '../../../shared/models/address';

export interface RegisterRequest {
  email: string;
  password: string;
  telephone: string;
  name: string;
  zipcode: string;
  address: Address;
}
