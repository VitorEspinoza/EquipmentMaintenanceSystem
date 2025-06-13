import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, of, startWith } from 'rxjs';
import { CrudService } from '../../../../core/services/crud.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Employee } from '../../../../shared/models/employee';
import { FormState, MaintenanceActionComponent } from '../../../requests/shared/models/maintenanceActionComponent';

@Component({
  selector: 'app-redirect-maintenance',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule],
  templateUrl: './redirect-maintenance.component.html',
  styleUrl: './redirect-maintenance.component.css',
})
export class RedirectMaintenanceComponent implements MaintenanceActionComponent, OnInit {
  private readonly notificationService = inject(NotificationService);
  private readonly crudService = inject(CrudService);
  private readonly destroyRef = inject(DestroyRef);

  readonly employeeSearchControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [],
  });

  readonly employeeControl = new FormControl<Employee | null>(null, [Validators.required]);

  private readonly employees = signal<Employee[]>([]);
  isLoading = signal<boolean>(false);
  private readonly searchError = signal<boolean>(false);

  readonly searchTerm = toSignal(
    this.employeeSearchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(term => (term || '').toString().trim())
    ),
    { initialValue: '' }
  );

  readonly filteredEmployees = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const allEmployees = this.employees();

    if (!search || search.length < 1) {
      return allEmployees;
    }

    const filtered = allEmployees.filter(employee => {
      const name = employee?.name?.toLowerCase() || '';
      const email = employee?.email?.toLowerCase() || '';

      return name.includes(search) || email.includes(search);
    });

    return filtered.slice(0, 20);
  });

  readonly selectedEmployee = toSignal(this.employeeControl.valueChanges.pipe(startWith(this.employeeControl.value)), {
    initialValue: this.employeeControl.value,
  });

  readonly formState = computed<FormState<number | null>>(() => {
    const selectedEmployee = this.selectedEmployee();

    return {
      formData: selectedEmployee?.id ?? null,
      isValid: this.employeeControl.valid && !this.searchError(),
    };
  });

  readonly hasSearchError = computed(() => this.searchError());

  constructor() {
    effect(() => {
      const searchTerm = this.searchTerm().toLowerCase();
      const selectedEmployee = this.employeeControl.value;
      const filteredResults = this.filteredEmployees();

      const showError = searchTerm.length >= 2 && !selectedEmployee && filteredResults.length === 0;

      this.searchError.set(showError);
    });
  }

  ngOnInit(): void {
    this.loadEmployees();

    this.employeeSearchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        map(term => (term || '').toString().trim())
      )
      .subscribe(term => {
        console.log('Search term changed:', term);
      });
  }

  onEmployeeSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedEmployee = event.option.value as Employee;
    this.employeeControl.setValue(selectedEmployee);
    this.employeeSearchControl.setValue('');
    this.searchError.set(false);
  }

  private loadEmployees(): void {
    this.isLoading.set(true);

    this.crudService
      .get<{ data: { content: Employee[] } }>('employees/all?excludeSelf=true')
      .pipe(
        map(response => response.data.content),
        catchError(() => {
          this.notificationService.error('Não foi possível carregar os funcionários');
          return of([]);
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(employees => {
        this.employees.set(employees);
      });
  }
}
