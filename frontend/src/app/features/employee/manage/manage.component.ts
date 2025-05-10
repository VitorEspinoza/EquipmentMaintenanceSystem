import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTable, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import moment from 'moment';
import { NgxMaskDirective } from 'ngx-mask';
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
  MatTableModule,
  MatDatepickerModule,
  MatNativeDateModule,
];
const FORM_MODULES = [ReactiveFormsModule, FormsModule];
const COMMON_MODULES = [CommonModule];
const CORE_MODULES = [RouterModule];
const NGXCONFIG = [NgxMaskDirective];

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-crud',
  imports: [...COMMON_MODULES, ...CORE_MODULES, ...MATERIAL_MODULES, ...FORM_MODULES, ...NGXCONFIG],
  providers: [provideMomentDateAdapter(MY_DATE_FORMATS)],
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  employees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  currentUserId = 1;

  employeeForm!: FormGroup;

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthDate: [null, Validators.required],
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

    const birthDate = this.employeeForm.get('birthDate')?.value;

    if (moment.isMoment(birthDate)) {
      console.log('Data é um objeto Moment:', birthDate.format('DD/MM/YYYY'));
    } else if (birthDate instanceof Date) {
      console.log('Data é um objeto Date:', birthDate);
    } else {
      console.error('Tipo de data inválido!');
    }

    if (emp.id) {
      const index = this.employees.findIndex(e => e.id === emp.id);
      if (index !== -1) {
        console.log('Atualizando o funcionário:', emp);
        this.employees[index] = emp;
        this.employees = [...this.employees];
      } else {
        console.error('Funcionário não encontrado para atualização.');
      }
    } else {
      emp.id = this.generateId();
      console.log('Adicionando novo funcionário:', emp);
      this.employees = [...this.employees, emp];
    }

    console.log('Lista de Funcionários:', this.employees);

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

  formatDate(event: any) {
    let input = event.target.value.replace(/\D/g, '');
    if (input.length > 2) input = input.slice(0, 2) + '/' + input.slice(2);
    if (input.length > 5) input = input.slice(0, 5) + '/' + input.slice(5);
    event.target.value = input;
  }
}
