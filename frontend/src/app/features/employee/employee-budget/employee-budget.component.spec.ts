import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeBudgetComponent } from './employee-budget.component';

describe('EmployeeBudgetComponent', () => {
  let component: EmployeeBudgetComponent;
  let fixture: ComponentFixture<EmployeeBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeBudgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
