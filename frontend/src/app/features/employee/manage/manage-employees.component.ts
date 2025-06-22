import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { RouterModule } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { catchError, map, of, switchMap } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';
import { DynamicTableComponent } from '../../../shared/components/dynamic-table/dynamic-table.component';
import { ConfirmDeleteModalComponent } from '../../../shared/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { TableColumn } from '../../../shared/models/TableColumn';
import { AuthService } from '../../auth/services/auth.service';
import { Employee } from '../models/Employee';
import { EmployeeService } from '../services/employee.service';
import { DefaultResponse } from './../../../shared/models/DefaultResponse';
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
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  @ViewChild(FormGroupDirective) private formDirective!: FormGroupDirective;

  readonly employees = signal<Employee[]>([]);

  private filterByActiveEmployees = signal<boolean>(true);

  private readonly employees$ = toObservable(this.filterByActiveEmployees).pipe(
    takeUntilDestroyed(),
    switchMap(active =>
      this.employeeService.getAll(active).pipe(
        map(response => response.data),
        catchError(err => {
          const errorMessage = err?.error?.errors?.join(', ') || 'Falha ao carregar funcionários';
          this.notificationService.error(errorMessage);
          return of([]);
        })
      )
    )
  );

  selectedEmployee = signal<Employee | null>(null);

  employeeForm!: FormGroup;

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

    const filterByActiveEmployees = this.filterByActiveEmployees();
    const canDelete = this.authService.account()?.email != element.email && filterByActiveEmployees;
    if (canDelete) actions.push(deleteAction);
    return actions;
  };

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthDate: [null, Validators.required],
      password: ['', Validators.required],
    });

    this.employees$.subscribe(fetchedEmployees => {
      this.employees.set(fetchedEmployees);
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const isUpdate = this.employeeForm.get('id')?.value;

    if (isUpdate) {
      this.updateEmployee();
    } else {
      this.createEmployee();
    }
  }

  private clearSelectionAndResetForm(): void {
    this.selectedEmployee.set(null);
    this.employeeForm.reset();
    if (this.formDirective) {
      this.formDirective.resetForm();
    }
  }

  updateEmployee() {
    const employee = this.employeeForm.value;

    this.employeeService.update(employee).subscribe({
      next: (response: DefaultResponse<Employee>) => {
        const updatedEmployee = response.data;
        this.employees.update(currentEmployees => {
          const updatedEmployeeIndex = currentEmployees.findIndex(e => e.id === updatedEmployee.id);

          if (updatedEmployeeIndex === -1) {
            return currentEmployees;
          }

          const newEmployees = [...currentEmployees];
          newEmployees[updatedEmployeeIndex] = updatedEmployee;

          return newEmployees;
        });

        this.notificationService.success('Funcionário atualizado!');
        this.clearSelectionAndResetForm();
      },
      error: () => {
        this.notificationService.error('Erro ao atualizar funcionário.');
      },
    });
  }

  createEmployee() {
    const employee = this.employeeForm.value;
    this.employeeService.create(employee).subscribe({
      next: (response: DefaultResponse<Employee>) => {
        const createdEmp = response.data;
        this.notificationService.success('Funcionário criado!');
        this.employees.update(currentEmployes => [...currentEmployes, createdEmp]);
        this.clearSelectionAndResetForm();
      },
      error: err => {
        const errorMessage = err?.error?.errors?.join(', ') || 'Houve um erro ao criar o funcionário.';
        this.notificationService.error(errorMessage);
      },
    });
  }

  setSelectedEmployee = (employee: Employee): void => {
    this.selectedEmployee.set(employee);
    this.employeeForm.patchValue(employee);

    this.employeeForm.get('password')?.clearValidators();
    this.employeeForm.get('password')?.updateValueAndValidity();
  };

  deleteEmployee = (emp: Employee): void => {
    const email = localStorage.getItem('email');
    if (emp.email === email) {
      this.notificationService.error('Você não pode se remover.');
      return;
    }

    if (this.employees.length === 1) {
      this.notificationService.error('Deve haver pelo menos um funcionário.');
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
            this.employees.update(currentEmployees => currentEmployees.filter(e => e.id !== emp.id));
            this.notificationService.success('Funcionário removido!');
          },
          error: err => {
            this.notificationService.error('Erro ao remover funcionário.' + (err.error?.message || ''));
          },
        });
      } else {
        this.notificationService.info('Exclusão cancelada.', 'Cancelada');
      }
    });
  };

  onToggleChange(): void {
    this.filterByActiveEmployees.update(value => !value);
  }
}
