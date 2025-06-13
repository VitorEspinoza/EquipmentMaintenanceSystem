import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMaintenanceRequestDetailsComponent } from './employee-maintenance-request-details.component';

describe('EmployeeMaintenanceRequestDetailsComponent', () => {
  let component: EmployeeMaintenanceRequestDetailsComponent;
  let fixture: ComponentFixture<EmployeeMaintenanceRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeMaintenanceRequestDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeMaintenanceRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
