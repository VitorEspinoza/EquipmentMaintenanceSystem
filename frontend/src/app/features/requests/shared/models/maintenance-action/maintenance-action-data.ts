import { Type } from '@angular/core';
import { IMaintenanceActionComponent } from './maintenance-action-component';

export interface MaintenanceActionData<TFormData = any> {
  title: string;
  actionName: string;
  component: Type<IMaintenanceActionComponent<TFormData>>;
  componentData?: any;
}
