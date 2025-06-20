import {
  Component,
  ComponentRef,
  computed,
  inject,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormState, MaintenanceActionComponent, MaintenanceActionData } from '../../models/maintenanceActionComponent';
@Component({
  selector: 'app-maintenance-request-action-details-modal',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './maintenance-request-action-details-modal.component.html',
  styleUrl: './maintenance-request-action-details-modal.component.css',
})
export class MaintenanceRequestActionDetailsModalComponent<TFormData = 'any'> implements OnInit, OnDestroy {
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef, static: true })
  dynamicComponentContainer!: ViewContainerRef;
  private componentRef = signal<ComponentRef<MaintenanceActionComponent<TFormData>> | null>(null);
  readonly data: MaintenanceActionData<TFormData> = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<MaintenanceRequestActionDetailsModalComponent>);

  private readonly formState: Signal<FormState<TFormData>> = computed(() => {
    const ref = this.componentRef();
    return (
      ref?.instance?.formState?.() ?? {
        formData: {} as TFormData,
        isValid: false,
      }
    );
  });

  readonly formData = computed(() => this.formState().formData);
  readonly isFormValid = computed(() => this.formState().isValid);

  ngOnInit(): void {
    this.loadDynamicComponent();
  }

  private loadDynamicComponent(): void {
    this.dynamicComponentContainer.clear();

    const componentRef: ComponentRef<MaintenanceActionComponent> = this.dynamicComponentContainer.createComponent(
      this.data.component
    );

    if (this.data.componentData) {
      Object.assign(componentRef.instance, this.data.componentData);
    }

    this.componentRef.set(componentRef);
  }

  ngOnDestroy(): void {
    const ref = this.componentRef();
    if (ref) {
      ref.destroy();
      this.componentRef.set(null);
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    if (this.isFormValid()) {
      const data = this.formData();
      if (data) {
        this.dialogRef.close(data);
      }
    }
  }
}
