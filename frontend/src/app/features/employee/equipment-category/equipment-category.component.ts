import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { EquipmentCategory } from '../../../shared/models/EquipmentCategory';
@Component({
  standalone: true,
  selector: 'app-equipment-category',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './equipment-category.component.html',
})
export class EquipmentCategoryComponent {
  categories: EquipmentCategory[] = [];
  category: EquipmentCategory = { id: 0, name: '', description: '', Active: false };
  private idCounter = 1;

  saveCategory(): void {
    if (this.category.id) {
      // Atualizar categoria existente
      const index = this.categories.findIndex(c => c.id === this.category.id);
      if (index !== -1) {
        this.categories[index] = { ...this.category };
      }
    } else {
      // Adicionar nova categoria
      this.category.id = this.idCounter++;
      this.categories.push({ ...this.category });
    }

    this.resetForm();
  }

  editCategory(cat: EquipmentCategory): void {
    this.category = { ...cat };
  }

  deleteCategory(id: number): void {
    this.categories = this.categories.filter(c => c.id !== id);
    this.resetForm();
  }

  resetForm(): void {
    this.category = { id: 0, name: '', description: '', Active: false };
  }
}
