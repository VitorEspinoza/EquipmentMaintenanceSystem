import { MaintenanceRequestState } from '../features/requests/shared/models/maintenance-request-state';

const translateRequestState = <T extends { state: string; stateHistory?: { state: string }[] }>(
  request: T
): T & { translatedState: string; stateHistory?: any[] } => {
  return {
    ...request,
    translatedState: MaintenanceRequestState[request.state as keyof typeof MaintenanceRequestState],
    stateHistory: request.stateHistory?.map(historyItem => ({
      ...historyItem,
      translatedState: MaintenanceRequestState[historyItem.state as keyof typeof MaintenanceRequestState],
    })),
  };
};
export { translateRequestState };
