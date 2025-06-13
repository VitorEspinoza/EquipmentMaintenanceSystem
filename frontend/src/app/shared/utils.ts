import { RequestState } from '../features/requests/shared/models/RequestState';

const translateRequestState = <T extends { state: string; stateHistory?: { state: string }[] }>(
  request: T
): T & { translatedState: string; stateHistory?: any[] } => {
  return {
    ...request,
    translatedState: RequestState[request.state as keyof typeof RequestState],
    stateHistory: request.stateHistory?.map(historyItem => ({
      ...historyItem,
      translatedState: RequestState[historyItem.state as keyof typeof RequestState],
    })),
  };
};
export { translateRequestState };
