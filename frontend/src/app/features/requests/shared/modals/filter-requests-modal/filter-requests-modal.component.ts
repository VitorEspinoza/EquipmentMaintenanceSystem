import { HttpParams } from '@angular/common/http';
import { Component, computed, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RequestState } from '../../models/RequestState';
import { FiltersFormValue } from './../../models/FiltersFormValue';
import { FiltersStateService } from './../../services/filters-state.service';
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
  private FiltersStateService = inject(FiltersStateService);
  private dialogData: { filters: FiltersFormValue } = inject(MAT_DIALOG_DATA);

  readonly requestStates = Object.entries(RequestState).map(([key, value]) => ({
    key: key as keyof typeof RequestState,
    label: value,
  }));

  filtersForm: FormGroup = this.fb.group({
    dateFilter: [null],
    from: [null],
    to: [null],
    state: [null],
  });

  cleanFilters = new HttpParams();

  private readonly dateFilterValue = toSignal(this.filtersForm.get('dateFilter')!.valueChanges);

  disableDateRange = computed(() => this.dateFilterValue() != 'DATE_RANGE');

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

  ngOnInit(): void {
    const savedFilters = this.FiltersStateService.recoveryFilters();
    const filters = savedFilters ? savedFilters : this.dialogData.filters;
    if (filters) {
      this.filtersForm.patchValue(filters);
      this.filtersForm.updateValueAndValidity();
    }
  }

  filtersFormToParams(): HttpParams {
    const filters = this.filtersForm.value;

    let params = new HttpParams();

    if (filters.dateFilter) {
      params = params.set('dateFilter', filters.dateFilter);
    }

    if (filters.from && filters.to) {
      params = params.set('from', this.formatDateOnly(filters.from));
      params = params.set('to', this.formatDateOnly(filters.to));
    }

    if (filters.state) {
      params = params.set('state', filters.state);
    }

    return params;
  }

  clearFilters() {
    this.filtersForm.reset();
    this.FiltersStateService.saveFilters(this.filtersForm.getRawValue());
  }

  saveFilters() {
    this.FiltersStateService.saveFilters(this.filtersForm.getRawValue());
  }

  private formatDateOnly(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
