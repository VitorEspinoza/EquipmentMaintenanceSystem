import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { map, startWith } from 'rxjs';
import { FormState } from '../../../requests/shared/models/maintenance-action/form-state';
import { IMaintenanceActionComponent } from '../../../requests/shared/models/maintenance-action/maintenance-action-component';
import { MaintenanceInfo } from '../../shared/models/maintenanceInfo';

@Component({
  selector: 'app-do-maintenance',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './do-maintenance.component.html',
  styleUrl: './do-maintenance.component.css',
})
export class DoMaintenanceComponent implements IMaintenanceActionComponent {
  private fb = inject(FormBuilder);
  maintenanceInfoForm: FormGroup = this.fb.group({
    maintenanceDescription: ['', Validators.required],
    customerGuidelines: ['', Validators.required],
  });

  readonly formValue = toSignal(this.maintenanceInfoForm.valueChanges, {
    initialValue: this.maintenanceInfoForm.value,
  });
  readonly isFormValid = toSignal(
    this.maintenanceInfoForm.statusChanges.pipe(
      startWith(this.maintenanceInfoForm.status),
      map(() => this.maintenanceInfoForm.valid)
    ),
    { initialValue: this.maintenanceInfoForm.valid }
  );
  formState = computed<FormState<MaintenanceInfo | null>>(() => {
    return {
      formData: this.formValue(),
      isValid: this.isFormValid(),
    };
  });
}
