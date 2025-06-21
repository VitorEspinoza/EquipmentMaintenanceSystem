import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { NotificationService } from '../../../core/services/notification.service';
import { DynamicTableComponent } from '../../../shared/components/dynamic-table/dynamic-table.component';
import { ConfirmDeleteModalComponent } from '../../../shared/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { DefaultResponse } from '../../../shared/models/DefaultResponse';
import { TableColumn } from '../../../shared/models/TableColumn';
import { Employee } from '../models/Employee';
import { EmployeeService } from '../services/employee.service';
import { TableAction } from './../../../shared/models/TableColumn';

const MATERIAL_MODULES = [
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatOptionModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatTableModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSlideToggleModule,
  MatDialogModule,
];
const FORM_MODULES = [ReactiveFormsModule, FormsModule];
const COMMON_MODULES = [CommonModule];
const CORE_MODULES = [RouterModule];
const NGXCONFIG = [NgxMaskDirective];
const SMART_COMPONENTS = [DynamicTableComponent];

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
  imports: [
    ...COMMON_MODULES,
    ...CORE_MODULES,
    ...MATERIAL_MODULES,
    ...FORM_MODULES,
    ...NGXCONFIG,
    ...SMART_COMPONENTS,
  ],
  providers: [provideMomentDateAdapter(MY_DATE_FORMATS)],
  templateUrl: './manage-employees.component.html',
  styleUrls: ['./manage-employees.component.css'],
})
export class ManageEmployeesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  @ViewChild('form') form: any;

  employees: Employee[] = [];
  selectedEmployee: Employee | null = null;

  employeeForm!: FormGroup;

  isChecked = false;
  loggedEmail = localStorage.getItem('email');

  tableColumns = signal<TableColumn[]>([
    {
      key: 'name',
      header: 'Nome',
      type: 'text',
      slice: { start: 0, end: 30 },
    },
    {
      key: 'email',
      header: 'Email',
      type: 'text',
    },
    {
      key: 'birthDate',
      header: 'Nascimento',
      type: 'date',
      dateFormat: 'dd/MM/yyyy HH:mm',
    },
    {
      key: 'actions',
      header: 'Ações',
      type: 'actions',
    },
  ]);

  handleAction(event: { tableAction: TableAction<'EDIT' | 'DELETE'>; element: Employee }) {
    const action = event.tableAction.action;
    const actionHandler = {
      EDIT: this.setSelectedEmployee,
      DELETE: this.deleteEmployee,
    };
    actionHandler[action](event.element);
  }

  getRowActions = (element: Employee): TableAction<'EDIT' | 'DELETE'>[] => {
    const editAction: TableAction<'EDIT' | 'DELETE'> = {
      label: 'Editar',
      action: 'EDIT',
    };

    const deleteAction: TableAction<'EDIT' | 'DELETE'> = {
      label: 'Excluir',
      action: 'DELETE',
    };

    const actions = [editAction];

    if (element.email != this.loggedEmail) actions.push(deleteAction);
    return actions;
  };

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

  loadEmployees(): void {
    this.employeeService.getAll(!this.isChecked).subscribe({
      next: (response: DefaultResponse<Employee[]>) => {
        if (response.isSuccess) {
          this.employees = response.data;
        } else {
          this.notificationService.error('Erro', response.errors.join(', ') || 'Falha ao carregar funcionários');
        }
      },
      error: err => {
        this.notificationService.error('Erro', 'Erro de comunicação com o servidor');
      },
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) return;

    const isUpdate = this.employeeForm.get('id')?.value;

    if (isUpdate) {
      this.updateEmployee();
    } else {
      this.createEmployee();
    }

    this.selectedEmployee = null;
    this.employeeForm.reset();
    this.form.resetForm();
  }

  updateEmployee() {
    const employee = this.employeeForm.value;

    this.employeeService.update(employee).subscribe({
      next: (response: DefaultResponse<Employee>) => {
        if (response.isSuccess) {
          const updatedEmp = response.data;
          const index = this.employees.findIndex(e => e.id === updatedEmp.id);

          if (index !== -1) {
            this.employees[index] = updatedEmp;
            this.employees = [...this.employees];
            this.notificationService.success('Sucesso', 'Funcionário atualizado!');
          } else {
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
  }

  createEmployee() {
    this.employeeService.create(emp).subscribe({
      next: (response: DefaultResponse<Employee>) => {
        if (response.isSuccess) {
          const createdEmp = response.data;
          this.notificationService.success('Sucesso', 'Funcionário criado!');
          this.employees = [...this.employees, createdEmp];
        } else {
          this.notificationService.error('Erro', response.errors.join(', ') || 'Falha ao criar funcionário');
        }
      },
      error: err => {
        const errorMessage = err?.error?.errors?.join(', ') || 'Erro de comunicação com o servidor';
        this.notificationService.error('Erro', errorMessage);
      },
    });
  }

  setSelectedEmployee = (emp: Employee): void => {
    this.selectedEmployee = emp;
    this.employeeForm.patchValue(emp);

    this.employeeForm.get('password')?.clearValidators();
    this.employeeForm.get('password')?.updateValueAndValidity();
  };

  deleteEmployee = (emp: Employee): void => {
    const email = localStorage.getItem('email');
    if (emp.email === email) {
      this.notificationService.error('Erro', 'Você não pode se remover.');
      return;
    }

    if (this.employees.length === 1) {
      this.notificationService.error('Erro', 'Deve haver pelo menos um funcionário.');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDeleteModalComponent, {
      width: '400px',
      data: {
        message: `Você tem certeza que deseja excluir "${emp.name}"?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.employeeService.delete(emp.id).subscribe({
          next: () => {
            this.loadEmployees();
            this.notificationService.success('Sucesso', 'Funcionário removido!');
          },
          error: err => {
            this.notificationService.error('Erro', 'Erro ao remover funcionário.' + (err.error?.message || ''));
          },
        });
      } else {
        this.notificationService.info('Cancelado', 'Exclusão cancelada.');
      }
    });
  };

  formatDate(event: any) {
    let input = event.target.value.replace(/\D/g, '');
    if (input.length > 2) input = input.slice(0, 2) + '/' + input.slice(2);
    if (input.length > 5) input = input.slice(0, 5) + '/' + input.slice(5);
    event.target.value = input;
  }

  onToggleChange(): void {
    this.loadEmployees();
  }
}
