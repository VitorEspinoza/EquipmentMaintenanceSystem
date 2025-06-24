import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CrudService } from '../../../core/services/crud.service';
import { DefaultResponse } from '../../../shared/models/DefaultResponse';
import { Employee } from '../models/Employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private crudService = inject(CrudService);
  employeePrefix = 'employees';

  getAll(isChecked: boolean): Observable<DefaultResponse<Employee[]>> {
    const params = new HttpParams().set('active', isChecked.toString());

    const queryString = params.toString();
    const endpoint = `${this.employeePrefix}/all?${queryString}`;

    return this.crudService.get<DefaultResponse<Employee[]>>(endpoint);
  }

  create(employee: Employee): Observable<DefaultResponse<Employee>> {
    return this.crudService.post<DefaultResponse<Employee>>(`${this.employeePrefix}/register`, employee).pipe(
      map(response => {
        return response;
      })
    );
  }

  update(employee: Employee): Observable<DefaultResponse<Employee>> {
    return this.crudService.put<DefaultResponse<Employee>>(`${this.employeePrefix}/${employee.id}`, employee).pipe(
      map(response => {
        return response;
      })
    );
  }

  delete(id: number): Observable<DefaultResponse<void>> {
    return this.crudService.delete<DefaultResponse<void>>(`${this.employeePrefix}`, id).pipe(
      map(response => {
        return response;
      })
    );
  }
}
