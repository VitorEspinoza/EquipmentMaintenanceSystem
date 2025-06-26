import { Signal } from '@angular/core';
import { FormState } from './form-state';

export interface IMaintenanceActionComponent<TFormData = any> {
  formState: Signal<FormState<TFormData>>;
}
