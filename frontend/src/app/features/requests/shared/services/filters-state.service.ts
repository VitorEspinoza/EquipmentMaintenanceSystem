import { Injectable, signal } from '@angular/core';
import { FiltersFormValue } from '../models/FiltersFormValue';

@Injectable({
  providedIn: 'root',
})
export class FiltersStateService {
  private filters = signal<FiltersFormValue | null>(null);

  recoveryFilters(): FiltersFormValue | null {
    return this.filters();
  }

  saveFilters(filtersFormValue: FiltersFormValue) {
    this.filters.set(filtersFormValue);
  }
}
