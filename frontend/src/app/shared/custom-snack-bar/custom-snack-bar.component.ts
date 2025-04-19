import { CommonModule, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { SnackBarData } from '../models/SnackBarData';
import { CustomSnackBarService } from '../services/services/custom-snack-bar.service';

const COMMON_MODULES = [NgIf, CommonModule];
const FORM_MODULES = [ReactiveFormsModule, FormsModule];

@Component({
  selector: 'app-custom-snack-bar',
  imports: [...COMMON_MODULES, FORM_MODULES],
  templateUrl: './custom-snack-bar.component.html',
})
export class CustomSnackBarComponent {
  snackBarRef = inject(MatSnackBarRef<CustomSnackBarComponent>);
  data = inject(MAT_SNACK_BAR_DATA) as SnackBarData;
  private snackBarService = inject(CustomSnackBarService);

  motivoRejeicao: string = '';

  dismiss() {
    this.snackBarRef.dismiss();
  }

  rejeitarServico() {
    if (this.motivoRejeicao.trim()) {
      this.data.motivoRejeicao = this.motivoRejeicao;
      this.dismiss();

      this.snackBarService.show(this.data);
    } else {
      alert('Por favor, informe um motivo para a rejeição.');
    }
  }
}
