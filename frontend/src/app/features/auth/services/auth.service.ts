import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CrudService } from '../../../core/services/crud.service';
import { Account } from '../models/account';
import { LoginRequest } from '../models/loginRequest';
import { RegisterRequest } from '../models/registerRequest';
import { DefaultResponse } from './../../../shared/models/DefaultResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private crudService = inject(CrudService);
  authPrefix = 'auth';
  clientPrefix = 'clients';
  account = signal<Account | null>(null);

  isAuthenticated = computed(() => {
    const account = this.account();
    console.log(account, 'isAuthenticated');
    return account != null;
  });

  private setAccount(authRequest$: Observable<DefaultResponse<Account>>): Observable<DefaultResponse<Account>> {
    return authRequest$.pipe(tap(response => this.account.set(response.data)));
  }

  login(credentials: LoginRequest): Observable<DefaultResponse<Account>> {
    const url = `${this.authPrefix}/login`;
    const request$ = this.crudService.post<DefaultResponse<Account>>(url, credentials);

    return this.setAccount(request$);
  }

  register(credentials: RegisterRequest): Observable<DefaultResponse<Account>> {
    const request$ = this.crudService.post<DefaultResponse<Account>>(`${this.clientPrefix}`, credentials);
    return this.setAccount(request$);
  }

  getAccount(): Observable<DefaultResponse<Account>> {
    return this.crudService
      .get<DefaultResponse<Account>>(`${this.authPrefix}/me`)
      .pipe(tap(response => this.account.set(response.data)));
  }

  logout(): Observable<void> {
    return this.crudService.post<void>(`${this.authPrefix}/logout`, {}).pipe(
      tap(() => {
        console.log('tapeei por aqui');
        this.account.set(null);
      })
    );
  }
}
