import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectMaintenanceModalComponent } from './redirect-maintenance-modal.component';

describe('RedirectMaintenanceModalComponent', () => {
  let component: RedirectMaintenanceModalComponent;
  let fixture: ComponentFixture<RedirectMaintenanceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedirectMaintenanceModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RedirectMaintenanceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
