import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from '../../core/services/crud.service';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private readonly viaCepUrl = 'https://viacep.com.br/ws';
  private readonly ibgeUrl = 'https://servicodados.ibge.gov.br';
  private readonly crudService = inject(CrudService);

  searchAddressByZipcode(zipcode: string): Observable<any> {
    const endpoint = `/${zipcode}/json/`;
    return this.crudService.get(endpoint, undefined, this.viaCepUrl);
  }
}
