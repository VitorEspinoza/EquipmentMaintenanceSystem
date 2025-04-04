import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

const MATERIAL_MODULES = [
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatSelectModule,
];
const FORM_MODULES = [ReactiveFormsModule, FormsModule];
const COMMON_MODULES = [NgIf];
const CORE_MODULES = [RouterModule];

// Enum de categorias de equipamento
export enum EquipmentCategory {
  NOTEBOOK = 'Notebook',
  DESKTOP = 'Desktop',
  PERIFERICO = 'Periférico',
}

@Component({
  selector: 'app-maintenance-request',
  imports: [...MATERIAL_MODULES, ...FORM_MODULES, ...COMMON_MODULES, ...CORE_MODULES],
  templateUrl: './maintenancerequest.component.html',
  styleUrls: ['./maintenancerequest.component.css'],
})
export class MaintenanceRequestComponent implements OnInit {
  maintenanceForm!: FormGroup;

  status: string = 'ABERTA';

  equipmentCategories = Object.values(EquipmentCategory);

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.maintenanceForm = this.fb.group({
      equipmentDescription: ['', [Validators.required, Validators.minLength(3)]],
      equipmentCategory: ['', Validators.required],
      defectDescription: ['', [Validators.required, Validators.minLength(10)]],
      requestDate: [new Date(), Validators.required], // Data e hora atual
      status: [this.status],
    });
  }

  onSubmit() {
    if (this.maintenanceForm.valid) {
      console.log('Solicitação de Manutenção:', this.maintenanceForm.value);
    } else {
      console.log('Formulário inválido');
    }
  }
}
