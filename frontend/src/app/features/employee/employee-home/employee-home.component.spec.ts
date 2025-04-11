import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeHomeComponent } from './employee-home.component';

describe('EmployeeHomeComponent', () => {
  let component: EmployeeHomeComponent;
  let fixture: ComponentFixture<EmployeeHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should only show open solicitations', () => {
    const openSolicitations = component.solicitations.every(s => s.status === 'ABERTA');
    expect(openSolicitations).toBeTrue();
  });

  it('should limit description lenght to 30 caracters', () => {
    const longDescription = 'Computador Dell 24 polegadas, Placa de Vídeo GTX1650, i5 de décima geração';
    expect(component.getTruncatedDescription(longDescription).length).toBeLessThanOrEqual(30);
  });
});
