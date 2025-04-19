import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBarComponent } from '../../custom-snack-bar/custom-snack-bar.component';
import { SnackBarData } from '../../models/SnackBarData';

@Injectable({
  providedIn: 'root',
})
export class CustomSnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  show(data: SnackBarData) {
    this.snackBar.openFromComponent(CustomSnackBarComponent, {
      data: data,
      horizontalPosition: 'center',
      panelClass: 'custom-notification',
    });
  }
}
