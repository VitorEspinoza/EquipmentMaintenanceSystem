import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

interface EquipmentCategory {
  id: number;
  name: string;
}

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
  ],
  templateUrl: './equipment-category.component.html',
})
export class EquipmentCategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  @ViewChild('form') form: any;
  categories: EquipmentCategory[] = [];
  private idCounter = 1;
  editingId: number | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/\S+/)]],
    });
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) return;

    const name = this.categoryForm.value.name.trim();

    if (this.editingId) {
      const index = this.categories.findIndex(c => c.id === this.editingId);
      if (index !== -1) {
        this.categories[index] = { id: this.editingId, name };
      }
    } else {
      this.categories.push({ id: this.idCounter++, name });
    }

    this.resetForm();
  }

  editCategory(cat: EquipmentCategory): void {
    this.editingId = cat.id;
    this.categoryForm.setValue({ name: cat.name });
  }

  deleteCategory(id: number): void {
    this.categories = this.categories.filter(c => c.id !== id);
    this.resetForm();
  }

  resetForm(): void {
    this.editingId = null;
    this.categoryForm.reset({ name: '' });
    this.form.resetForm();
  }
}
