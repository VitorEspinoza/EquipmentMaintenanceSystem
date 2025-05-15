import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-redirect-maintenance-modal',
  standalone: true,
  templateUrl: './redirect-maintenance-modal.component.html',
  styleUrls: ['./redirect-maintenance-modal.component.css'],
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatSelectModule, MatButtonModule, FormsModule],
})
export class RedirectMaintenanceModalComponent {
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<RedirectMaintenanceModalComponent>);

  selectedEmployee: string | null = null;

  confirmRedirect() {
    if (this.selectedEmployee) {
      this.dialogRef.close(this.selectedEmployee);
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
