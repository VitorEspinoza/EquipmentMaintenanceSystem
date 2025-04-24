import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';

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
export class BudgetRejectionModalComponent {
  private readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<BudgetRejectionModalComponent>);

  rejectionReasonControl = new FormControl<string>('');

  get rejectionReason(): string {
    return this.rejectionReasonControl.value ?? '';
  }
}
