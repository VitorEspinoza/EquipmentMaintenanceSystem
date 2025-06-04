import { Signal, Type } from '@angular/core';

export interface MaintenanceActionComponent<TFormData = any> {
  formState: Signal<FormState<TFormData>>;
}

export interface FormState<TFormData = any> {
  formData: TFormData;
  isValid: boolean;
}

export interface MaintenanceActionData<TFormData = any> {
  title: string;
  actionName: string;
  component: Type<MaintenanceActionComponent<TFormData>>;
  componentData?: any;
}
