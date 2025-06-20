import { HttpParams } from '@angular/common/http';
import { InjectionToken, Signal, Type } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DefaultResponse } from '../../../../shared/models/DefaultResponse';
import { MaintenanceRequest } from './maintenanceRequest';

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

export interface MaintenanceRequestStrategy {
  requestService: IMaintenanceRequestService;
  getRequest(id: string): Observable<MaintenanceRequest>;
  getAvailableActions(request: MaintenanceRequest): MaintenanceAction[];
}

export const MAINTENANCE_REQUEST_STRATEGY = new InjectionToken<MaintenanceRequestStrategy>(
  'Strategy Token for Maintenance Requests'
);

export enum MaintenanceAction {
  APPROVE = 'Aprovar',
  REJECT = 'Rejeitar',
  QUOTE = 'Orçar',
  REDIRECT = 'Redirecionar',
  DO_MAINTENANCE = 'Realizar',
  COMPLETE = 'Finalizar',
  RESCUE = 'Resgatar',
  PAY = 'Pagar',
}

export interface IMaintenanceRequestService {
  getAll(params?: HttpParams): Observable<DefaultResponse<MaintenanceRequest[]>>;
  getById(id: string): Observable<DefaultResponse<MaintenanceRequest>>;
  executeAction(requestId: string, action: MaintenanceAction): Observable<void>;
}
