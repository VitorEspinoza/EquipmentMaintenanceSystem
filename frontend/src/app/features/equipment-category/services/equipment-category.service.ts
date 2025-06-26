import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CrudService } from '../../../core/services/crud.service';
import { DefaultResponse } from '../../../shared/models/DefaultResponse';
import { EquipmentCategory } from '../../../shared/models/EquipmentCategory';

@Injectable({
  providedIn: 'root',
})
export class EquipmentCategoryService {
  private readonly crudService = inject(CrudService);

  categoryPrefix = 'categories';

  getEquipmentCategories(isChecked: boolean): Observable<DefaultResponse<EquipmentCategory[]>> {
    const params = new HttpParams().set('active', isChecked.toString());

    const queryString = params.toString();

    return this.crudService
      .get<DefaultResponse<EquipmentCategory[]>>(`${this.categoryPrefix}?${queryString}`)
      .pipe(map(response => response));
  }

  updateEquipmentCategory(category: EquipmentCategory): Observable<DefaultResponse<EquipmentCategory>> {
    return this.crudService
      .put<DefaultResponse<EquipmentCategory>>(`${this.categoryPrefix}/${category.id}`, category)
      .pipe(map(response => response));
  }

  createEquipmentCategory(category: EquipmentCategory): Observable<DefaultResponse<EquipmentCategory>> {
    return this.crudService
      .post<DefaultResponse<EquipmentCategory>>(`${this.categoryPrefix}`, category)
      .pipe(map(response => response));
  }

  deleteEquipmentCategory(id: number): Observable<DefaultResponse<void>> {
    return this.crudService.delete<DefaultResponse<void>>(`${this.categoryPrefix}`, id).pipe(
      map(response => {
        return response;
      })
    );
  }
}
