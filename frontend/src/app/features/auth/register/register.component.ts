import { CommonModule, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
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
import { catchError, of, switchMap } from 'rxjs';
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
export class RegisterComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly addressService = inject(AddressService);
  private readonly notificationService = inject(NotificationService);

  registerForm!: FormGroup;

  zipCodeFlag = false;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      cpf: ['', [Validators.required, Validators.pattern(/^.{11}$/)]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      zipcode: ['', [Validators.required, Validators.pattern(/^.{8}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^.{10,11}$/)]],
      street: [{ value: '', disabled: true }, [Validators.required]],
      number: ['', [Validators.required, Validators.pattern('^[0-9]{1,6}$')]],
      neighbourhood: [{ value: '', disabled: true }, [Validators.required]],
      city: [{ value: '', disabled: true }, [Validators.required]],
      state: [{ value: '', disabled: true }, [Validators.required]],
      complement: [''],
    });

    this.registerForm
      .get('zipcode')
      ?.valueChanges.pipe(
        switchMap(value => {
          if (value && value.length === 8) {
            return this.addressService
              .searchAddressByZipcode(value)
              .pipe(catchError(() => of('Erro ao acessar api Viacep!')));
          }
          return of(null);
        })
      )
      .subscribe({
        next: (response: { logradouro: string; bairro: string; localidade: string; estado: string; erro: boolean }) => {
          if (response.erro) return this.notificationService.error('CEP inválido ou não encontrado.');
          this.registerForm.patchValue({
            street: response.logradouro,
            neighbourhood: response.bairro,
            city: response.localidade,
            state: response.estado,
          });

          this.registerForm.get('state')?.setValue(response.estado, { emitEvent: false });
          this.registerForm.get('city')?.setValue(response.localidade, { emitEvent: false });
          this.registerForm.get('city')?.updateValueAndValidity();
          this.zipCodeFlag = true;
        },
      });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const raw = this.registerForm.getRawValue();
    const payload = {
      cpf: raw.cpf,
      name: raw.name,
      email: raw.email,
      phone: raw.phone,
      address: {
        zipcode: raw.zipcode,
        street: raw.street,
        number: raw.number,
        neighbourhood: raw.neighbourhood,
        city: raw.city,
        state: raw.state,
        complement: raw.complement,
      },
    };

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
