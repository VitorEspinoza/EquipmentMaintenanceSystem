import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NotificationService } from '../../../../core/services/notification.service';
import { EquipmentCategoryService } from '../../../equipment-category/services/equipment-category.service';
import { EquipmentCategory } from './../../../../shared/models/EquipmentCategory';

@Component({
  selector: 'app-create-request-modal',
  imports: [MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './create-request-modal.component.html',
  styleUrl: './create-request-modal.component.css',
})
export class CreateRequestModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private equipmentCategoryService = inject(EquipmentCategoryService);
  private notificationService = inject(NotificationService);
  equipmentCategories: EquipmentCategory[] = [];
  maintenanceRequestForm: FormGroup = this.fb.group({
    equipmentDescription: ['', Validators.required],
    defectDescription: ['', Validators.required],
    equipmentCategoryId: [null, Validators.required],
  });

  ngOnInit(): void {
    this.loadEquipmentCategories();
  }

  loadEquipmentCategories(): void {
    this.equipmentCategoryService.getEquipmentCategories(true).subscribe({
      next: response => (this.equipmentCategories = response.data),
      error: () => this.notificationService.error('Erro', 'Falha ao carregar categorias de equipamento'),
    });
  }
}
