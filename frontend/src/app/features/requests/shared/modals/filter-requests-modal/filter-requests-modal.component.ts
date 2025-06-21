import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { map, startWith } from 'rxjs';
import { RequestState } from '../../models/RequestState';
import { FiltersFormValue } from './../../models/FiltersFormValue';
@Component({
  selector: 'app-filter-requests-modal',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  templateUrl: './filter-requests-modal.component.html',
  styleUrl: './filter-requests-modal.component.css',
})
export class FilterRequestsModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogData: { filters: FiltersFormValue } = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<FilterRequestsModalComponent>);

  readonly requestStates = Object.entries(RequestState).map(([key, value]) => ({
    key: key as keyof typeof RequestState,
    label: value,
  }));

  readonly dateFilterList = [
    {
      label: 'Hoje',
      value: 'TODAY',
    },
    {
      label: 'Intervalo de datas',
      value: 'DATE_RANGE',
    },
    {
      label: 'Todas',
      value: 'ALL',
    },
  ];

  filtersForm: FormGroup = this.fb.group({
    dateFilter: [null],
    from: [null],
    to: [null],
    state: [null],
  });

  private readonly dateFilterValue = toSignal(this.filtersForm.get('dateFilter')!.valueChanges);

  readonly hasFiltersApplied = toSignal(
    this.filtersForm.valueChanges.pipe(
      startWith(this.filtersForm.value),
      map(formValue => Object.values(formValue).some(value => value !== null && value !== ''))
    ),
    { initialValue: false }
  );

  disableDateRange = computed(() => this.dateFilterValue() != 'DATE_RANGE');

  constructor() {
    effect(() => {
      const value = this.dateFilterValue();

      const fromControl = this.filtersForm.get('from')!;
      const toControl = this.filtersForm.get('to')!;

      if (value === 'DATE_RANGE') {
        fromControl.setValidators([Validators.required]);
        toControl.setValidators([Validators.required]);
      } else {
        fromControl.clearValidators();
        toControl.clearValidators();
      }

      fromControl.updateValueAndValidity({ emitEvent: false });
      toControl.updateValueAndValidity({ emitEvent: false });
    });
  }
  ngOnInit(): void {
    if (this.dialogData?.filters) {
      this.filtersForm.patchValue(this.dialogData.filters);
    }
  }

  clearFilters() {
    this.dialogRef.close({ clear: true });
  }
  applyFilters() {
    this.dialogRef.close(this.filtersForm.getRawValue());
  }
}
