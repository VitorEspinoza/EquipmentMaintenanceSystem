import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-report-filter-modal',
  imports: [MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatDatepickerModule, MatButtonModule],
  templateUrl: './report-filter-modal.component.html',
  styleUrl: './report-filter-modal.component.css',
})
export class ReportFilterModalComponent {
  private readonly fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ReportFilterModalComponent>);

  filtersForm: FormGroup = this.fb.group({
    from: [null],
    to: [null],
  });

  readonly hasFiltersApplied = toSignal(
    this.filtersForm.valueChanges.pipe(
      startWith(this.filtersForm.value),
      map(formValue => Object.values(formValue).some(value => value !== null && value !== ''))
    ),
    { initialValue: false }
  );

  applyFilters(): void {
    const filters = this.filtersForm.value;
    this.dialogRef.close(filters);
  }
}
