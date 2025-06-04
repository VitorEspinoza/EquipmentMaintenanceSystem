import { Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, Validators } from '@angular/forms';
import {
  FormState,
  MaintenanceActionComponent,
} from '../../../../shared/maintenance-request-details/models/maintenanceActionComponent';

@Component({
  selector: 'app-redirect-maintenance',
  imports: [],
  templateUrl: './redirect-maintenance.component.html',
  styleUrl: './redirect-maintenance.component.css',
})
export class RedirectMaintenanceComponent implements MaintenanceActionComponent {
  quotePriceControl = new FormControl<string>('', Validators.required);

  quotePrice = toSignal(this.quotePriceControl.valueChanges, {
    initialValue: this.quotePriceControl.value,
  });
  formState = computed<FormState<string | null>>(() => {
    console.log('Form state computed:', this.quotePriceControl.valid, this.quotePrice());
    return {
      formData: this.quotePrice(),
      isValid: this.quotePriceControl.valid,
    };
  });
}
