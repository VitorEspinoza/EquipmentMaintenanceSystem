import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CrudService } from '../../../core/services/crud.service';
import { ApiResponse } from '../../../shared/models/ApiResponse';
import { EquipmentCategory } from '../../../shared/models/EquipmentCategory';
import { Page } from '../../../shared/models/page';
import { Employee } from '../models/Employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private crudService = inject(CrudService);
  employeePrefix = 'employees';
  categoryPrefix = 'categories';

  getAll(page: number, size: number, isChecked: boolean): Observable<ApiResponse<Page<Employee>>> {
    // prettier-ignore
    const params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', size.toString())
      .set('active', isChecked.toString())
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

  update(employee: Employee): Observable<ApiResponse<Employee>> {
    return this.crudService.put<ApiResponse<Employee>>(`${this.employeePrefix}/${employee.id}`, employee).pipe(
      map(response => {
        return response;
      })
    );
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.crudService.delete<ApiResponse<void>>(`${this.employeePrefix}`, id).pipe(
      map(response => {
        return response;
      })
    );
  }

  getEquipmentCategories(isChecked: boolean): Observable<ApiResponse<EquipmentCategory[]>> {
    const params = new HttpParams().set('active', isChecked.toString());

    const queryString = params.toString();

    return this.crudService
      .get<ApiResponse<EquipmentCategory[]>>(`${this.categoryPrefix}?${queryString}`)
      .pipe(map(response => response));
  }

  updateEquipmentCategory(category: EquipmentCategory): Observable<ApiResponse<EquipmentCategory>> {
    return this.crudService
      .put<ApiResponse<EquipmentCategory>>(`${this.categoryPrefix}/${category.id}`, category)
      .pipe(map(response => response));
  }

  createEquipmentCategory(category: EquipmentCategory): Observable<ApiResponse<EquipmentCategory>> {
    return this.crudService
      .post<ApiResponse<EquipmentCategory>>(`${this.categoryPrefix}`, category)
      .pipe(map(response => response));
  }

  deleteEquipmentCategory(id: number): Observable<ApiResponse<void>> {
    return this.crudService.delete<ApiResponse<void>>(`${this.categoryPrefix}`, id).pipe(
      map(response => {
        return response;
      })
    );
  }
}
