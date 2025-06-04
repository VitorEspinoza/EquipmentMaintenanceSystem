import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import {
  FormState,
  MaintenanceActionComponent,
} from '../../../../../../shared/maintenance-request-details/models/maintenanceActionComponent';

@Component({
  selector: 'app-budget-rejection-modal',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  templateUrl: './budget-rejection-modal.component.html',
  styleUrl: './budget-rejection-modal.component.css',
})
export class BudgetRejectionModalComponent implements MaintenanceActionComponent<string | null> {
  rejectionReasonControl = new FormControl<string>('', Validators.required);

  rejectionReason = toSignal(this.rejectionReasonControl.valueChanges, {
    initialValue: this.rejectionReasonControl.value,
  });

  formState = computed<FormState<string | null>>(() => ({
    formData: this.rejectionReason(),
    isValid: this.rejectionReasonControl.valid,
  }));
}
