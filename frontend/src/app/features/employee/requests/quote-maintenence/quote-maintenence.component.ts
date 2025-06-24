import { Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FormState } from '../../../requests/shared/models/maintenance-action/form-state';
import { IMaintenanceActionComponent } from '../../../requests/shared/models/maintenance-action/maintenance-action-component';

@Component({
  selector: 'app-quote-maintenence',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgxMaskDirective],
  templateUrl: './quote-maintenence.component.html',
  styleUrl: './quote-maintenence.component.css',
  providers: [provideNgxMask()],
})
export class QuoteMaintenenceModalComponent implements IMaintenanceActionComponent<string | null> {
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
