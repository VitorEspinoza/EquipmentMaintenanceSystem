import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSolicitationsComponent } from './employee-solicitations.component';

describe('EmployeeSolicitationsComponent', () => {
  let component: EmployeeSolicitationsComponent;
  let fixture: ComponentFixture<EmployeeSolicitationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeSolicitationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeSolicitationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
