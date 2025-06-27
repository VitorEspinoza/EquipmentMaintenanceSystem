import { effect, inject, Injectable, Signal, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Role } from '../../../../core/models/role';
import { AuthService } from '../../../auth/services/auth.service';
import { FilterRequestsModalComponent } from '../modals/filter-requests-modal/filter-requests-modal.component';
import { FiltersFormValue } from '../models/filters-form-value';

export const INITIAL_EMPLOYEE_FILTERS_STATE: FiltersFormValue = {
  dateFilter: 'ALL',
  from: null,
  to: null,
  state: 'OPEN',
};

export const CLEARED_FILTERS_STATE: FiltersFormValue = {
  dateFilter: '',
  from: null,
  to: null,
  state: null,
};

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private dialog = inject(MatDialog);
  private readonly authService = inject(AuthService);
  private readonly _filters = signal<FiltersFormValue>(CLEARED_FILTERS_STATE);

  public readonly filters: Signal<FiltersFormValue> = this._filters.asReadonly();

  constructor() {
    effect(() => {
      const userRole = this.authService.account()?.role;

      if (userRole === Role.EMPLOYEE) {
        this._filters.set(INITIAL_EMPLOYEE_FILTERS_STATE);
      } else {
        this._filters.set(CLEARED_FILTERS_STATE);
      }
    });
  }

  public resetFilters(): void {
    this._filters.set(CLEARED_FILTERS_STATE);
  }

  public updateFilters(filtersFormValue: FiltersFormValue): void {
    this._filters.set(filtersFormValue);
  }

  openFilterModal(): void {
    const dialogData: { filters: Partial<FiltersFormValue> | null } = {
      filters: this.filters(),
    };

    this.dialog
      .open(FilterRequestsModalComponent, {
        maxWidth: '90vw',
        minWidth: '400px',
        maxHeight: '90vh',
        data: dialogData,
      })
      .afterClosed()
      .subscribe((result: FiltersFormValue | { clear: boolean } | undefined) => {
        if (!result) return;
        if ('clear' in result && result.clear) {
          this.resetFilters();
        } else {
          this.updateFilters(result as FiltersFormValue);
        }
      });
  }
}
