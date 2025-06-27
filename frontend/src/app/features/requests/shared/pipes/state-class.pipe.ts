import { Pipe, PipeTransform } from '@angular/core';
import { MaintenanceRequestState } from '../models/maintenance-request-state';
import { getStateClass } from '../utils/maintenance-request.utils';

@Pipe({
  name: 'stateClass',
})
export class StateClassPipe implements PipeTransform {
  transform(value: MaintenanceRequestState | string | undefined | null): string {
    if (!value) {
      return getStateClass('default');
    }
    return getStateClass(value);
  }
}
