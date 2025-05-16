import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-redirect-maintenance-modal',
  templateUrl: './redirect-maintenance-modal.component.html',
  styleUrl: './redirect-maintenance-modal.component.css',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatButtonModule,
  ],
})
export class RedirectMaintenanceModalComponent {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  myControl = new FormControl('');
  options: string[] = ['Ian Bailone Almeida', 'Vitor Espinoza', 'Gabriel Veiga'];
  filteredOptions: string[] = [...this.options];

  private dialogRef = inject(MatDialogRef<RedirectMaintenanceModalComponent>);

  constructor() {
    this.filteredOptions = this.options.slice();
  }

  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredOptions = this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  confirm(): void {
    this.dialogRef.close(this.myControl.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
