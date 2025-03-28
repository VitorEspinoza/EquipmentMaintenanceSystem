import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { catchError, of, switchMap } from 'rxjs';
import { AddressService } from '../../../shared/models/service/address.service';
import { AuthService } from '../services/auth.service';

const MATERIAL_MODULES = [MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatIconModule];
const FORM_MODULES = [ReactiveFormsModule, FormsModule];
const COMMON_MODULES = [NgIf];
const CORE_MODULES = [RouterModule];
const NGXCONFIG = [NgxMaskDirective, NgxMaskPipe];

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
  private readonly addressService = inject(AddressService); // Inject AddressService

  registerForm!: FormGroup;

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
        cpf: ['', [Validators.required, Validators.pattern(/^.{11}$/)]],
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        zipcode: ['', [Validators.required, Validators.pattern(/^.{8}$/)]],
        phone: ['', [Validators.required, Validators.pattern(/^.{10,11}$/)]],
        street: ['', [Validators.required]],
        number: ['', [Validators.required]],
        neighbourhood: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        complement: [''],
      },
      { validators: passwordMatchValidator }
    );
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
        next: (endereco: { logradouro: string; bairro: string; localidade: string; estado: string }) => {
          if (endereco) {
            this.registerForm.patchValue({
              street: endereco.logradouro,
              neighbourhood: endereco.bairro,
              city: endereco.localidade,
              state: endereco.estado,
            });
          }
        },
        error: (message: string) => {
          console.error(message);
        },
      });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.authService.register(this.registerForm.value).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  const haveError =
    password !== confirmPassword && control.get('confirmPassword')?.dirty && control.get('password')?.dirty;

  return !haveError ? null : { passwordMismatch: true };
};
