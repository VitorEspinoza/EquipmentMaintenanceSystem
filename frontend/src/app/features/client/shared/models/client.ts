import { Address } from '../../../../shared/models/address';

export interface Client {
  id: number;
  email: string;
  name: string;
  phone: string;
  address: Address;
}
