import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator'; // Added MatPaginatorModule
import { MatSelectModule } from '@angular/material/select';
import { MatTable, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import moment from 'moment';
import { NgxMaskDirective } from 'ngx-mask';
import { NotificationService } from '../../../core/services/notification.service';
import { ApiResponse } from '../../../shared/models/ApiResponse';
import { Page } from '../../../shared/models/page';
import { Employee } from '../models/Employee';
import { EmployeeService } from '../services/employee.service';

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
  MatPaginatorModule,
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
  private readonly employeeService = inject(EmployeeService);
  private readonly notificationService = inject(NotificationService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('form') form: any;

  employees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  currentUserId = 1;

  employeeForm!: FormGroup;

  // MatPaginator properties
  totalElements = 0;
  pageIndex = 0;
  pageSize = 10;

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthDate: [null, Validators.required],
      password: ['', Validators.required],
      role: ['EMPLOYEE'],
    });

    this.loadEmployees();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadEmployees(this.pageIndex, this.pageSize);
  }

  loadEmployees(pageIndex = 0, pageSize = 10): void {
    this.employeeService.getAll(pageIndex, pageSize).subscribe({
      next: (response: ApiResponse<Page<Employee>>) => {
        console.log('response:', response);
        if (response.isSuccess) {
          this.employees = response.data.content;
          this.totalElements = response.data.totalElements;
        } else {
          this.notificationService.error('Erro', response.errors.join(', ') || 'Falha ao carregar funcionários');
        }
      },
      error: err => {
        console.error('Erro ao carregar funcionários:', err);
        this.notificationService.error('Erro', 'Erro de comunicação com o servidor');
      },
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
      this.employeeService.update(emp).subscribe({
        next: (response: ApiResponse<Employee>) => {
          if (response.isSuccess) {
            const updatedEmp = response.data;
            const index = this.employees.findIndex(e => e.id === updatedEmp.id);

            if (index !== -1) {
              this.employees[index] = updatedEmp;
              this.employees = [...this.employees];
              this.notificationService.success('Sucesso', 'Funcionário atualizado!');
            } else {
              console.error('Funcionário não encontrado na lista para atualização.');
              this.notificationService.error('Erro', 'Funcionário não encontrado na lista.');
            }
          } else {
            const msg = response.errors?.join(', ') || 'Falha ao atualizar funcionário.';
            this.notificationService.error('Erro', msg);
          }
        },
        error: () => {
          this.notificationService.error('Erro', 'Erro ao atualizar funcionário.');
        },
      });
    } else {
      this.employeeService.create(emp).subscribe({
        next: (response: ApiResponse<Employee>) => {
          console.log('response:', response);
          if (response.isSuccess) {
            console.log('Funcionário criado com sucesso:', response.data);
            const createdEmp = response.data;
            this.notificationService.success('Sucesso', 'Funcionário criado!');
            this.employees = [...this.employees, createdEmp];
          } else {
            this.notificationService.error('Erro', response.errors.join(', ') || 'Falha ao criar funcionário');
          }
        },
        error: () => {
          this.notificationService.error('Erro', 'Erro de comunicação com o servidor');
        },
      });

      console.log('Adicionando novo funcionário:', emp);
    }

    console.log('Lista de Funcionários:', this.employees);

    this.selectedEmployee = null;
    this.employeeForm.reset();
    this.form.resetForm();
  }

  editEmployee(emp: Employee): void {
    this.selectedEmployee = emp;
    this.employeeForm.patchValue({ ...emp });

    this.employeeForm.get('password')?.clearValidators();
    this.employeeForm.get('password')?.updateValueAndValidity();
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

  formatDate(event: any) {
    let input = event.target.value.replace(/\D/g, '');
    if (input.length > 2) input = input.slice(0, 2) + '/' + input.slice(2);
    if (input.length > 5) input = input.slice(0, 5) + '/' + input.slice(5);
    event.target.value = input;
  }
}
