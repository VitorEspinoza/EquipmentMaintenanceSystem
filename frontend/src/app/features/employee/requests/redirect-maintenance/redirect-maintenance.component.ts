import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, of, startWith } from 'rxjs';
import { CrudService } from '../../../../core/services/crud.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { DefaultResponse } from '../../../../shared/models/DefaultResponse';
import { Employee } from '../../../../shared/models/employee';
import { FormState, MaintenanceActionComponent } from '../../../requests/shared/models/maintenanceActionComponent';

export function requireObjectSelection(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value && typeof value === 'string') {
    return { requireSelection: true };
  }
  return null;
}

@Component({
  selector: 'app-redirect-maintenance',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './redirect-maintenance.component.html',
  styleUrl: './redirect-maintenance.component.css',
})
export class RedirectMaintenanceComponent implements MaintenanceActionComponent, OnInit {
  private readonly notificationService = inject(NotificationService);
  private readonly crudService = inject(CrudService);
  private readonly destroyRef = inject(DestroyRef);

  readonly employeeControl = new FormControl<string | Employee | null>('', [
    Validators.required,
    requireObjectSelection,
  ]);

  private readonly employees = signal<Employee[]>([]);
  readonly isLoading = signal<boolean>(false);

  readonly employeeValue = toSignal(this.employeeControl.valueChanges, { initialValue: this.employeeControl.value });

  readonly searchTerm = toSignal(
    this.employeeControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => (typeof value === 'string' ? value : (value?.name ?? ''))),
      distinctUntilChanged()
    ),
    { initialValue: '' }
  );

  readonly filteredEmployees = computed(() => {
    const search = this.searchTerm().toLowerCase();

    const allEmployees = this.employees();
    if (!search) {
      return allEmployees.slice(0, 20);
    }
    return allEmployees
      .filter(employee => {
        const name = employee?.name?.toLowerCase() || '';
        const email = employee?.email?.toLowerCase() || '';
        return name.includes(search) || email.includes(search);
      })
      .slice(0, 20);
  });

  readonly selectedEmployee = computed(() => {
    const value = this.employeeValue();
    return typeof value === 'object' && value !== null ? value : null;
  });

  readonly isFormValid = toSignal(
    this.employeeControl.statusChanges.pipe(
      startWith(this.employeeControl.status),
      map(() => this.employeeControl.valid)
    ),
    { initialValue: this.employeeControl.valid }
  );

  readonly formState = computed<FormState<number | null>>(() => {
    const employee = this.selectedEmployee();

    return {
      formData: employee ? employee.id : null,
      isValid: this.isFormValid(),
    };
  });

  ngOnInit(): void {
    this.loadEmployees();
  }

  displayFn(employee: Employee): string {
    return employee && employee.name ? employee.name : '';
  }

  private loadEmployees(): void {
    this.isLoading.set(true);
    this.crudService
      .get<DefaultResponse<Employee[]>>('employees/all?excludeSelf=true')
      .pipe(
        map(response => response.data),
        catchError(() => {
          this.notificationService.error('Não foi possível carregar os funcionários');
          return of([]);
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(employees => {
        if (employees.length == 0) this.notificationService.warning('Não existem funcionários para redirecionar');
        this.employees.set(employees);
      });
  }
}
