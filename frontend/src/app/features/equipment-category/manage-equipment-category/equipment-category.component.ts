import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { NotificationService } from '../../../core/services/notification.service';
import { DefaultResponse } from '../../../shared/models/DefaultResponse';
import { EquipmentCategoryService } from '../services/equipment-category.service';
import { DynamicTableComponent } from '../../../shared/components/dynamic-table/dynamic-table.component';
import { TableAction, TableColumn } from '../../../shared/models/TableColumn';
import { EquipmentCategory } from '../../../shared/models/EquipmentCategory';

@Component({
  standalone: true,
  selector: 'app-equipment-category',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    DynamicTableComponent,
  ],
  templateUrl: './equipment-category.component.html',
})
export class EquipmentCategoryComponent implements OnInit {
  private readonly equipmentCategoryService = inject(EquipmentCategoryService);
  private readonly notificationService = inject(NotificationService);
  private readonly fb = inject(FormBuilder);
  @ViewChild('form') form: any;

  categories: EquipmentCategory[] = [];
  selectedCategory: EquipmentCategory | null = null;

  categoryForm!: FormGroup;

  isChecked = false;

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
  handleAction(event: { tableAction: TableAction<'EDIT' | 'DELETE'>; element: EquipmentCategory }) {
    const action = event.tableAction.action;
    if (action === 'EDIT') {
      this.editCategory(event.element);
    } else if (action === 'DELETE') {
      this.deleteCategory(event.element.id);
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

    const actions = [editAction, deleteAction];
    return actions;
  };

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.pattern(/\S+/)]],
    });

    this.loadCategories();
  }

  loadCategories(): void {
    this.equipmentCategoryService.getEquipmentCategories(!this.isChecked).subscribe({
      next: (response: DefaultResponse<EquipmentCategory[]>) => {
        if (response.isSuccess) {
          this.categories = response.data;
        } else {
          this.notificationService.error('Erro', response.errors.join(', ') || 'Falha ao carregar categorias');
        }
      },
      error: err => {
        console.error('Erro ao carregar categorias:', err);
        this.notificationService.error('Erro', 'Erro de comunicação com o servidor');
      },
    });
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) return;

    const category = this.categoryForm.value;
    console.log('Salvando categoria:', category);
    if (category.id) {
      this.equipmentCategoryService.updateEquipmentCategory(category).subscribe({
        next: (response: DefaultResponse<EquipmentCategory>) => {
          if (response.isSuccess) {
            const updatedCategory = response.data;
            const index = this.categories.findIndex(e => e.id === updatedCategory.id);

            if (index !== -1) {
              this.categories[index] = updatedCategory;
              this.categories = [...this.categories];
              this.notificationService.success('Sucesso', 'Categoria atualizado!');
            } else {
              console.error('Categoria não encontrado na lista para atualização.');
              this.notificationService.error('Erro', 'Categoria não encontrado na lista.');
            }
          } else {
            const msg = response.errors?.join(', ') || 'Falha ao atualizar Categoria.';
            this.notificationService.error('Erro', msg);
          }
        },
        error: () => {
          this.notificationService.error('Erro', 'Erro ao atualizar categoria.');
        },
      });
    } else {
      this.equipmentCategoryService.createEquipmentCategory(category).subscribe({
        next: (response: DefaultResponse<EquipmentCategory>) => {
          if (response.isSuccess) {
            const createdCategory = response.data;
            this.notificationService.success('Sucesso', 'Funcionário criado!');
            this.categories = [...this.categories, createdCategory];
          } else {
            this.notificationService.error('Erro', response.errors.join(', ') || 'Falha ao criar categoria');
          }
        },
        error: err => {
          const errorMessage = err?.error?.errors?.join(', ') || 'Erro de comunicação com o servidor';
          this.notificationService.error('Erro', errorMessage);
        },
      });
    }

    this.resetForm();
  }

  editCategory(cat: EquipmentCategory): void {
    this.selectedCategory = cat;
    this.categoryForm.patchValue({ ...cat });
  }

  deleteCategory(id: number): void {
    this.equipmentCategoryService.deleteEquipmentCategory(id).subscribe({
      next: () => {
        this.loadCategories();
        this.notificationService.success('Sucesso', 'Categoria excluída com sucesso!');
      },
      error: err => {
        console.error('Erro ao excluir categoria:', err);
        this.notificationService.error('Erro', 'Erro de comunicação com o servidor');
      },
    });
    this.resetForm();
  }

  resetForm(): void {
    this.selectedCategory = null;
    this.categoryForm.reset({ name: '' });
    this.form.resetForm();
  }
}
