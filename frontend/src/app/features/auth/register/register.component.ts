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
import { AddressService } from '../../../shared/models/service/addressService';
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
        cpf: ['', [Validators.required, Validators.length(11)]],
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        zipcode: ['', [Validators.required, Validators.minLength(8)]],
        phone: ['', [Validators.required, Validators.minLength(10)]],
      },
      { validators: passwordMatchValidator }
    );
    this.registerForm.get('cpf')?.valueChanges.subscribe(value => {
      console.log(value);
    });
  }

  searchAddressByZipcode() {
    this.addressService.searchAddressByZipcode(this.registerForm.get('zipcode')?.value).subscribe(endereco => {
      this.registerForm.patchValue({
        street: endereco.logradouro,
        neighborhood: endereco.bairro,
        city: endereco.localidade,
        state: endereco.estado,
      });
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
