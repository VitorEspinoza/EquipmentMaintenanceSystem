export interface RegisterRequest {
  cpf: string;
  name: string;
  email: string;
  phone: string;
  address: {
    zipcode: string;
    street: string;
    number: string;
    neighbourhood: string;
    city: string;
    state: string;
    complement?: string;
  };
}
