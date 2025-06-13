import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CrudService } from '../../../core/services/crud.service';
import { DefaultResponse } from '../../../shared/models/DefaultResponse';
import { Page } from '../../../shared/models/page';
import { Employee } from '../models/Employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private crudService = inject(CrudService);
  employeePrefix = 'employees';

  getAll(page: number, size: number, isChecked: boolean): Observable<DefaultResponse<Page<Employee>>> {
    const params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', size.toString())
      .set('active', isChecked.toString());

    const queryString = params.toString();
    const endpoint = `${this.employeePrefix}/all?${queryString}`;

    return this.crudService.get<DefaultResponse<Page<Employee>>>(endpoint).pipe(map(response => response));
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
