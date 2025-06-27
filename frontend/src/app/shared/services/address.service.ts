import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from '../../core/services/crud.service';
import { ViaCepResponse } from '../models/ViaCepResponse';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private readonly viaCepUrl = 'https://viacep.com.br/ws';
  private readonly crudService = inject(CrudService);

  searchAddressByZipcode(zipcode: string): Observable<ViaCepResponse> {
    const endpoint = `/${zipcode}/json/`;
    return this.crudService.get(endpoint, undefined, this.viaCepUrl);
  }
}
