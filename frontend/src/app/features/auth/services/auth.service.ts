import { inject, Injectable, signal } from '@angular/core';
import { CrudService } from '../../../core/services/crud.service';
import { map, Observable, tap } from 'rxjs';
import { LoginResponse } from '../models/loginResponse';
import { LoginRequest } from '../models/loginRequest';
import { RegisterRequest } from '../models/registerRequest';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticatedSign = signal(false);
  private crudService = inject(CrudService);
  authPrefix = 'auth';

  isAuthenticated(): boolean {
    return this.authenticatedSign();
  }

  private setAuthenticated(value: boolean) {
    this.authenticatedSign.set(value);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.crudService.post<LoginResponse>(`${this.authPrefix}/login`, credentials).pipe(
      map(response => {
        this.setAuthenticated(true);
        return response;
      })
    );
  }

  register(credentials: RegisterRequest): Observable<LoginResponse> {
    return this.crudService.post<LoginResponse>(`${this.authPrefix}/register`, credentials);
  }

  logout(): Observable<void> {
    return this.crudService.post<void>(`${this.authPrefix}/logout`, {}).pipe(tap(() => this.setAuthenticated(false)));
  }
}
