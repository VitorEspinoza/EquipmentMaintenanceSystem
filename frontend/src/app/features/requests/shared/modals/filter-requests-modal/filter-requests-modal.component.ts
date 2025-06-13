import { HttpParams } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NotificationService } from '../../../../../core/services/notification.service';
import { RequestState } from '../../models/RequestState';

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
export class FilterRequestsModalComponent {
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);

  readonly requestStates = Object.entries(RequestState).map(([key, value]) => ({
    key: key as keyof typeof RequestState,
    label: value,
  }));

  filtersForm: FormGroup = this.fb.group({
    dateFilter: ['ALL', Validators.required],
    from: [null],
    to: [null],
    state: [null],
  });

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

  filterQueryParams(): HttpParams {
    const rawValue = this.filtersForm.value;

    let params = new HttpParams();

    if (rawValue.dateFilter) {
      params = params.set('dateFilter', rawValue.dateFilter);
    }

    if (rawValue.from && rawValue.to) {
      params = params.set('from', this.formatDateOnly(rawValue.from));
      params = params.set('to', this.formatDateOnly(rawValue.to));
    }

    if (rawValue.state) {
      params = params.set('state', rawValue.state);
    }

    return params;
  }
  private formatDateOnly(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
