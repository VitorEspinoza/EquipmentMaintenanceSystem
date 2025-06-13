import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDeleteData {
  message: string;
}

@Component({
  selector: 'app-confirm-delete-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div style="overflow: hidden" class="flex flex-col justify-between h-full min-w-[320px] p-6">
      <div class="w-full mb-4">
        <h2 class="text-lg font-semibold">Confirmação de exclusão</h2>
      </div>

      <div class="flex-1 overflow-auto py-4 text-gray-800">
        <p>{{ data.message }}</p>
      </div>

      <mat-dialog-actions>
        <div class="mt-5 mb-2 w-full flex justify-between">
          <button mat-button class="w-[49%] btn-actions" type="button" (click)="cancel()">Cancelar</button>

          <button mat-raised-button color="warn" class="w-[49%]" (click)="confirm()">Excluir</button>
        </div>
      </mat-dialog-actions>
    </div>
  `,
})
export class ConfirmDeleteModalComponent {
  readonly data = inject<ConfirmDeleteData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ConfirmDeleteModalComponent>);

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
