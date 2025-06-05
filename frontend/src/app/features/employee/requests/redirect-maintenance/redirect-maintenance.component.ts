import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { map } from 'rxjs';
import { CrudService } from '../../../../core/services/crud.service';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  FormState,
  MaintenanceActionComponent,
} from '../../../../shared/maintenance-request-details/models/maintenanceActionComponent';
import { Employee } from '../../../../shared/models/employee';

@Component({
  selector: 'app-redirect-maintenance',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule],
  templateUrl: './redirect-maintenance.component.html',
  styleUrl: './redirect-maintenance.component.css',
})
export class RedirectMaintenanceComponent implements MaintenanceActionComponent, OnInit {
  private readonly notificationService = inject(NotificationService);
  private readonly crudService = inject(CrudService);

  employeeControl = new FormControl<string | Employee>('', Validators.required);
  employees: Employee[] = [];
  searchedEmployee = toSignal(this.employeeControl.valueChanges, {
    initialValue: this.employeeControl.value,
  });

  filteredEmployees: Signal<Employee[] | undefined> = computed(() => {
    return this.employees.filter(employee => {
      const searchValue = this.searchedEmployee()?.toString()?.toLowerCase();
      if (searchValue)
        return employee.name.toLowerCase().includes(searchValue) || employee.email.toLowerCase().includes(searchValue);

      return [];
    });
  });

  formState = computed<FormState<string | null>>(() => {
    return {
      formData: 'this.quotePrice()',
      isValid: this.employeeControl.valid,
    };
  });

  ngOnInit(): void {
    this.crudService
      .get<any>('employees/all')
      .pipe(map(res => res.data.content))
      .subscribe({
        next: employees => {
          console.log('Employees loaded:', employees);
          this.employees = employees;
          this.filteredEmployees = employees;
        },
        error: () => {
          this.notificationService.error('Não foi possível carregar os funcionários');
        },
      });
  }
}
