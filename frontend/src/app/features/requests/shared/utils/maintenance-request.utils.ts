import { MaintenanceRequestState } from '../models/maintenance-request-state';

export const MAINTENANCE_REQUEST_STATE_CLASSES: Record<string, string> = {
  [MaintenanceRequestState.OPEN]: 'bg-gray-200 text-gray-800',
  [MaintenanceRequestState.QUOTED]: 'bg-orange-900 text-white',
  [MaintenanceRequestState.REJECTED]: 'bg-red-800 text-white',
  [MaintenanceRequestState.REDIRECTED]: 'bg-purple-200 text-purple-800',
  [MaintenanceRequestState.FIXED]: 'bg-blue-200 text-blue-800',
  [MaintenanceRequestState.APPROVED]: 'bg-yellow-200 text-yellow-800',
  [MaintenanceRequestState.PAID]: 'bg-orange-400 text-white',
  [MaintenanceRequestState.COMPLETED]: 'bg-green-200 text-green-800',
};

export function getStateClass(state: MaintenanceRequestState | string): string {
  const defaultClass = 'bg-gray-300 text-gray-800';
  return MAINTENANCE_REQUEST_STATE_CLASSES[state] || defaultClass;
}
