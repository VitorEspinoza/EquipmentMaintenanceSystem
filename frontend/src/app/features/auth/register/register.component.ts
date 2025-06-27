import { CommonModule, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, filter, switchMap } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';
import { AddressService } from '../../../shared/services/address.service';
import { AuthService } from '../services/auth.service';

const MATERIAL_MODULES = [
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatOptionModule,
  MatSelectModule,
  MatAutocompleteModule,
];
const FORM_MODULES = [ReactiveFormsModule, FormsModule];
const COMMON_MODULES = [NgIf, CommonModule];
const CORE_MODULES = [RouterModule];
const NGXCONFIG = [NgxMaskDirective];

@Component({
  selector: 'app-register',
  imports: [...COMMON_MODULES, ...CORE_MODULES, ...MATERIAL_MODULES, ...FORM_MODULES, ...NGXCONFIG],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly addressService = inject(AddressService);
  private readonly notificationService = inject(NotificationService);

  readonly validPhoneNumberPattern = /^(?:\(?([1-9][0-9])\)?\s?)?((?:9\d|[2-9])\d{3})-?(\d{4})$/;

  registerForm: FormGroup = this.fb.group({
    cpf: ['', [Validators.required, Validators.pattern(/^.{11}$/)]],
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(this.validPhoneNumberPattern)]],
    address: this.fb.group({
      zipcode: ['', [Validators.required, Validators.pattern(/^.{8}$/)]],
      street: [{ value: '', disabled: true }, [Validators.required]],
      number: ['', [Validators.required, Validators.pattern('^[0-9]{1,6}$')]],
      neighbourhood: [{ value: '', disabled: true }, [Validators.required]],
      city: [{ value: '', disabled: true }, [Validators.required]],
      state: [{ value: '', disabled: true }, [Validators.required]],
      complement: [''],
    }),
  });

  zipCodeFlag = signal(false);

  private address$ = this.registerForm.get('address.zipcode')!.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    filter((zipcode: string) => zipcode?.length === 8),
    switchMap((zipcode: string) =>
      this.addressService.searchAddressByZipcode(zipcode).pipe(
        catchError(() => {
          this.notificationService.error('Erro ao buscar endereço. Verifique sua conexão.');
          return EMPTY;
        })
      )
    )
  );
  private addressResult = toSignal(this.address$);

  constructor() {
    effect(() => {
      const address = this.addressResult();
      if (!address || address.erro) return;

      this.registerForm.patchValue({
        address: {
          street: address.logradouro,
          neighbourhood: address.bairro,
          city: address.localidade,
          state: address.estado,
        },
      });
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const payload = this.registerForm.getRawValue();
    this.authService.register(payload).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error: HttpErrorResponse) => {
        const errorMessage: string = error.error?.errors?.[0] || '';

        const errorMap: Record<string, string> = {
          'phone already in use': 'Este telefone já está cadastrado. Tente fazer login ou use outro telefone.',
          'email already in use': 'Este email já está cadastrado. Tente fazer login ou use outro email.',
          'cpf already in use': 'Este CPF já está cadastrado. Tente fazer login ou use outro CPF.',
          'cpf: número do registro': 'CPF inválido. Verifique e tente novamente.',
          'invalid phone number.': 'Número de telefone inválido. Verifique e tente novamente.',
        };

        const matchedMessage = Object.entries(errorMap).find(([key]) => errorMessage.toLowerCase().includes(key));

        if (matchedMessage) {
          this.notificationService.error(matchedMessage[1]);
        } else {
          this.notificationService.error('Erro ao registrar. Tente novamente mais tarde.');
        }
      },
    });
  }
}
