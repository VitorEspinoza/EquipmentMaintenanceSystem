import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-redirect-maintenance-modal',
  standalone: true,
  templateUrl: './redirect-maintenance-modal.component.html',
  styleUrls: ['./redirect-maintenance-modal.component.css'],
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
    const filterValue = this.input.nativeElement.value.toLocaleLowerCase();
    this.filteredOptions = this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  confirm(): void {
    this.dialogRef.close(this.myControl.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
