import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { map } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../services/auth.service';

const MATERIAL_MODULES = [MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatIconModule];
const FORM_MODULES = [ReactiveFormsModule, FormsModule];
const COMMON_MODULES = [NgIf];
const CORE_MODULES = [RouterModule];

@Component({
  selector: 'app-login',
  imports: [...MATERIAL_MODULES, ...FORM_MODULES, ...COMMON_MODULES, ...CORE_MODULES],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);

  loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.authService
      .login(this.loginForm.value)
      .pipe(map(response => response.data))
      .subscribe({
        next: () => {
          this.router.navigate(['/']);

          this.notificationService.success('Login feito com sucesso');
        },
        error: () => this.notificationService.error('Erro ao fazer login'),
      });
  }
}
