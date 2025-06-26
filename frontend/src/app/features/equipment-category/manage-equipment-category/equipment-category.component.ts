import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { catchError, map, of, switchMap } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';
import { DynamicTableComponent } from '../../../shared/components/dynamic-table/dynamic-table.component';
import { ConfirmDeleteModalComponent } from '../../../shared/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { DefaultResponse } from '../../../shared/models/DefaultResponse';
import { EquipmentCategory } from '../../../shared/models/EquipmentCategory';
import { TableAction, TableColumn } from '../../../shared/models/TableColumn';
import { EquipmentCategoryService } from '../services/equipment-category.service';

@Component({
  standalone: true,
  selector: 'app-equipment-category',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    DynamicTableComponent,
    MatSlideToggleModule,
  ],
  templateUrl: './equipment-category.component.html',
})
export class EquipmentCategoryComponent implements OnInit {
  private readonly equipmentCategoryService = inject(EquipmentCategoryService);
  private readonly notificationService = inject(NotificationService);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  categories = signal<EquipmentCategory[]>([]);
  filterByActiveCategories = signal<boolean>(true);

  selectedCategory = signal<EquipmentCategory | null>(null);

  categoryForm!: FormGroup;

  tableColumns = signal<TableColumn[]>([
    {
      key: 'name',
      header: 'Nome da Categoria',
      type: 'text',
      slice: { start: 0, end: 30 },
    },
    {
      key: 'actions',
      header: 'Ações',
      type: 'actions',
    },
  ]);

  private readonly categories$ = toObservable(this.filterByActiveCategories).pipe(
    takeUntilDestroyed(),
    switchMap(active =>
      this.equipmentCategoryService.getEquipmentCategories(active).pipe(
        map(response => response.data),
        catchError(err => {
          const errorMessage = err?.error?.errors?.join(', ') || 'Falha ao carregar categorias';
          this.notificationService.error(errorMessage);
          return of([]);
        })
      )
    )
  );
  handleAction(event: { tableAction: TableAction<'EDIT' | 'DELETE'>; element: EquipmentCategory }) {
    const action = event.tableAction.action;
    if (action === 'EDIT') {
      this.setSelectedCategory(event.element);
    } else if (action === 'DELETE') {
      this.deleteCategory(event.element);
    }
  }
  getRowActions = (): TableAction<'EDIT' | 'DELETE'>[] => {
    const editAction: TableAction<'EDIT' | 'DELETE'> = {
      label: 'Editar',
      action: 'EDIT',
    };

    const deleteAction: TableAction<'EDIT' | 'DELETE'> = {
      label: 'Excluir',
      action: 'DELETE',
    };
    const actions = [editAction];
    if (this.filterByActiveCategories()) actions.push(deleteAction);

    return actions;
  };

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.pattern(/\S+/)]],
    });

    this.categories$.subscribe(fetchedCategories => {
      this.categories.set(fetchedCategories);
    });
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const category = this.categoryForm.value;
    const isUpdate = !!category.id;
    if (isUpdate) {
      this.updateCategory();
    } else {
      this.createCategory();
    }
  }

  createCategory() {
    const category = this.categoryForm.value;
    this.equipmentCategoryService.createEquipmentCategory(category).subscribe({
      next: (response: DefaultResponse<EquipmentCategory>) => {
        const createdCategory = response.data;
        this.categories.update(categories => [...categories, createdCategory]);
        this.notificationService.success('Categoria criada!');

        this.clearSelectionAndResetForm();
      },
      error: err => {
        const errorMessage = err?.error?.errors?.join(', ') || 'Erro ao criar categoria, tente novamente mais tarde.';
        this.notificationService.error(errorMessage);
      },
    });
  }

  updateCategory(): void {
    const category = this.categoryForm.value;
    this.equipmentCategoryService.updateEquipmentCategory(category).subscribe({
      next: (response: DefaultResponse<EquipmentCategory>) => {
        const updatedCategory = response.data;
        this.categories.update(categories => {
          const updatedCategoryIndex = categories.findIndex(e => e.id === updatedCategory.id);

          if (updatedCategoryIndex === -1) {
            return categories;
          }

          const newCategories = [...categories];
          newCategories[updatedCategoryIndex] = updatedCategory;

          return newCategories;
        });
        this.notificationService.success('Categoria atualizada!');
        this.clearSelectionAndResetForm();
      },
      error: err => {
        const errorMessage = err?.error?.errors?.join(', ') || 'Erro ao criar categoria, tente novamente mais tarde.';
        this.notificationService.error(errorMessage);
      },
    });
  }

  setSelectedCategory(category: EquipmentCategory): void {
    this.selectedCategory.set(category);
    this.categoryForm.patchValue({ ...category });
  }

  deleteCategory(category: EquipmentCategory): void {
    const dialogRef = this.dialog.open(ConfirmDeleteModalComponent, {
      width: '400px',
      data: {
        message: `Você tem certeza que deseja excluir "${category.name}"?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.equipmentCategoryService.deleteEquipmentCategory(category.id).subscribe({
          next: () => {
            this.categories.update(currentCategories => currentCategories.filter(c => c.id !== category.id));
            this.notificationService.success('Categoria excluída com sucesso!');
          },
          error: () => {
            this.notificationService.error('Erro ao excluir categoria, tente novamente mais tarde.');
          },
        });
        this.clearSelectionAndResetForm();
      } else {
        this.notificationService.info('Exclusão cancelada.', 'Cancelada');
      }
    });
  }

  private clearSelectionAndResetForm(): void {
    this.selectedCategory.set(null);
    this.categoryForm.reset();
    if (this.formDirective) {
      this.formDirective.resetForm();
    }
  }

  onToggleChange(): void {
    this.filterByActiveCategories.update(value => !value);
  }
}
