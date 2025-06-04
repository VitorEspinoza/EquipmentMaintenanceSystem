import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoMaintenanceComponent } from './do-maintenance.component';

describe('DoMaintenanceComponent', () => {
  let component: DoMaintenanceComponent;
  let fixture: ComponentFixture<DoMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoMaintenanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
