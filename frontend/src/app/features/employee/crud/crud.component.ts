import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTable } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Employee } from '../models/Employee';

const MATERIAL_MODULES = [
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatOptionModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatTable,
];
const FORM_MODULES = [ReactiveFormsModule, FormsModule];
const COMMON_MODULES = [NgIf, CommonModule];
const CORE_MODULES = [RouterModule];

@Component({
  selector: 'app-crud',
  imports: [...COMMON_MODULES, ...CORE_MODULES, ...MATERIAL_MODULES, ...FORM_MODULES],
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css'],
})
export class CrudComponent {
  employees: Employee[] = [];
  employeeForm: FormGroup;
  selectedEmployee: Employee | null = null;
  currentUserId = 1;

  constructor(private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', Validators.required],
      password: ['', Validators.required],
    });

    // Inserindo um funcionário inicial
    this.employees.push({
      id: 1,
      name: 'Admin',
      email: 'admin@example.com',
      birthDate: new Date(1990, 1, 1),
      password: 'admin123',
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) return;

    const emp = this.employeeForm.value;

    if (emp.id) {
      const index = this.employees.findIndex(e => e.id === emp.id);
      if (index !== -1) this.employees[index] = emp;
    } else {
      emp.id = this.generateId();
      this.employees.push(emp);
    }

    this.employeeForm.reset();
    this.selectedEmployee = null;
  }

  editEmployee(emp: Employee): void {
    this.selectedEmployee = emp;
    this.employeeForm.setValue({ ...emp });
  }

  deleteEmployee(id: number): void {
    if (id === this.currentUserId) {
      alert('Você não pode se remover.');
      return;
    }

    if (this.employees.length === 1) {
      alert('Deve haver pelo menos um funcionário.');
      return;
    }

    this.employees = this.employees.filter(e => e.id !== id);
  }

  generateId(): number {
    return Math.max(...this.employees.map(e => e.id), 0) + 1;
  }
}
