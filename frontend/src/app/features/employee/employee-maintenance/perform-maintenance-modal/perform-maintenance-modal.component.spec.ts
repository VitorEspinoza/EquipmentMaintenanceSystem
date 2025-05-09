import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformMaintenaceModalComponent } from './perform-maintenance-modal.component';

describe('PerformMaintenaceModalComponent', () => {
  let component: PerformMaintenaceModalComponent;
  let fixture: ComponentFixture<PerformMaintenaceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformMaintenaceModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PerformMaintenaceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
