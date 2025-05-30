import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-perform-maintenace-modal',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './perform-maintenance-modal.component.html',
  styleUrl: './perform-maintenance-modal.component.css',
})
export class PerformMaintenaceModalComponent {
  private readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<PerformMaintenaceModalComponent>);

  maintenceDescription = new FormControl('', Validators.required);
  clientGuidance = new FormControl('', Validators.required);

  submit() {
    if (this.maintenceDescription.valid && this.clientGuidance.valid) {
      this.dialogRef.close({
        maintenceDescription: this.maintenceDescription.value,
        clientGuidance: this.clientGuidance.value,
      });
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
