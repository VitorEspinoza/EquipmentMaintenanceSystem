import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CrudService } from '../../../core/services/crud.service';
import { ApiResponse } from '../../../shared/models/ApiResponse';
import { Page } from '../../../shared/models/page';
import { Employee } from '../models/Employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private crudService = inject(CrudService);
  employeePrefix = 'employees';

  getAll(page = 0, size = 10): Observable<ApiResponse<Page<Employee>>> {
    // prettier-ignore
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    // prettier-ignore-end

    const queryString = params.toString();
    const endpoint = `${this.employeePrefix}/all?${queryString}`;

    return this.crudService.get<ApiResponse<Page<Employee>>>(endpoint).pipe(map(response => response));
  }

  create(employee: Employee): Observable<ApiResponse<Employee>> {
    return this.crudService.post<ApiResponse<Employee>>(`${this.employeePrefix}/register`, employee).pipe(
      map(response => {
        return response;
      })
    );
  }

  update(employee: Employee): Observable<Employee> {
    return this.crudService.put<Employee>(`${this.employeePrefix}/${employee.id}`, employee).pipe(
      map(response => {
        return response;
      })
    );
  }
}
