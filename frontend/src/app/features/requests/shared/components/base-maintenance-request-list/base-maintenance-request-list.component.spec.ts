import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseMaintenanceRequestListComponent } from './base-maintenance-request-list.component';

describe('BaseMaintenanceRequestListComponent', () => {
  let component: BaseMaintenanceRequestListComponent;
  let fixture: ComponentFixture<BaseMaintenanceRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseMaintenanceRequestListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseMaintenanceRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
