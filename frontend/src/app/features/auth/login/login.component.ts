import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Role } from '../../../core/models/role';
import { NotificationService } from '../../../core/services/notification.service';
import { PermissionService } from '../../../core/services/permission.service';
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
  private readonly permissionService = inject(PermissionService);
  loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.authService.login(this.loginForm.value).subscribe({
      next: response => {
        this.notificationService.success('Sucesso', 'Login');
        localStorage.setItem('email', this.loginForm.value.email);

        const roleActions = {
          [Role.EMPLOYEE]: this.employeeActions,
          [Role.CLIENT]: this.clientActions,
        };
        const userRole = response.data.role as keyof typeof Role;

        roleActions[userRole]();
      },
      error: () => this.notificationService.error('Error', 'Login'),
    });
  }

  employeeActions = () => {
    this.router.navigate(['/employee/requests']);
    this.permissionService.accountRole.set(Role.EMPLOYEE);
  };

  clientActions = () => {
    this.router.navigate(['/client/requests']);
    this.permissionService.accountRole.set(Role.CLIENT);
  };
}
