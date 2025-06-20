import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DoMaintenanceComponent } from './do-maintenance.component';

describe('DoMaintenanceComponent', () => {
  let component: DoMaintenanceComponent;
  let fixture: ComponentFixture<DoMaintenanceComponent>;

  beforeEach(async () => {
    // Configura o módulo de teste antes de cada 'it'
    await TestBed.configureTestingModule({
      // Importa o componente e os módulos necessários para formulários e animações
      imports: [DoMaintenanceComponent, ReactiveFormsModule, NoopAnimationsModule],
    }).compileComponents();

    // Cria uma instância do componente e seu ambiente de teste
    fixture = TestBed.createComponent(DoMaintenanceComponent);
    component = fixture.componentInstance;
    // Dispara o data binding inicial
    fixture.detectChanges();
  });

  it('should create the component', () => {
    // Um teste simples para garantir que o componente foi criado com sucesso
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields and be invalid', () => {
    // Verifica se o formulário foi criado
    expect(component.maintenanceInfoForm).toBeDefined();
    // Como ambos os campos são obrigatórios, o formulário deve começar inválido
    expect(component.maintenanceInfoForm.valid).toBeFalse();
  });

  it('should reflect initial form invalidity in the isFormValid signal', () => {
    // Verifica se o signal 'isFormValid' também reflete o estado inválido inicial
    expect(component.isFormValid()).toBeFalse();
  });


  it('should have required validators on maintenanceDescription and customerGuidelines', () => {
    // Pega os controles do form group
    const descriptionControl = component.maintenanceInfoForm.get('maintenanceDescription');
    const guidelinesControl = component.maintenanceInfoForm.get('customerGuidelines');

    // Define o valor como uma string vazia para disparar a validação
    descriptionControl?.setValue('');
    guidelinesControl?.setValue('');

    // Verifica se ambos os controles têm o erro 'required'
    expect(descriptionControl?.hasError('required')).toBeTrue();
    expect(guidelinesControl?.hasError('required')).toBeTrue();
  });

  it('should be invalid when only one field is filled', () => {
    const descriptionControl = component.maintenanceInfoForm.get('maintenanceDescription');
    const guidelinesControl = component.maintenanceInfoForm.get('customerGuidelines');

    // Preenche apenas um campo
    descriptionControl?.setValue('Test Description');

    // O formulário deve continuar inválido
    expect(component.maintenanceInfoForm.valid).toBeFalse();
    expect(component.isFormValid()).toBeFalse();

    // Limpa o primeiro e preenche o segundo para garantir o mesmo comportamento
    descriptionControl?.setValue('');
    guidelinesControl?.setValue('Test Guidelines');
    expect(component.maintenanceInfoForm.valid).toBeFalse();
    expect(component.isFormValid()).toBeFalse();
  });

  it('should become valid when all required fields are filled', () => {
    const descriptionControl = component.maintenanceInfoForm.get('maintenanceDescription');
    const guidelinesControl = component.maintenanceInfoForm.get('customerGuidelines');

    // Preenche ambos os campos obrigatórios
    descriptionControl?.setValue('Changed the main flux capacitor.');
    guidelinesControl?.setValue('Customer advised to not exceed 88 mph.');

    // Agora o formulário deve ser válido
    expect(component.maintenanceInfoForm.valid).toBeTrue();
    expect(component.isFormValid()).toBeTrue();
  });

  it('should become invalid again after a required field is cleared', () => {
    const descriptionControl = component.maintenanceInfoForm.get('maintenanceDescription');
    const guidelinesControl = component.maintenanceInfoForm.get('customerGuidelines');

    // Primeiro, torna o formulário válido
    descriptionControl?.setValue('Valid description');
    guidelinesControl?.setValue('Valid guidelines');
    expect(component.maintenanceInfoForm.valid).toBeTrue();

    // Depois, limpa um dos campos
    descriptionControl?.setValue('');

    // O formulário deve voltar a ser inválido
    expect(component.maintenanceInfoForm.valid).toBeFalse();
    expect(component.isFormValid()).toBeFalse();
  });

  describe('FormState Signal', () => {
    it('should reflect initial state correctly', () => {
      // Verifica o estado inicial do signal computado
      const currentState = component.formState();
      expect(currentState.isValid).toBeFalse();
      expect(currentState.formData).toEqual({
        maintenanceDescription: '',
        customerGuidelines: '',
      });
    });

    it('should update formData when form values change, but remain invalid', fakeAsync(() => {
      component.maintenanceInfoForm.get('maintenanceDescription')?.setValue('Partial update');
      tick(); // Aguarda a conclusão das operações assíncronas (atualização de signals)

      const currentState = component.formState();
      expect(currentState.isValid).toBeFalse(); // Continua inválido
      expect(currentState.formData?.maintenanceDescription).toBe('Partial update');
    }));

    it('should update both formData and isValid when form becomes valid', fakeAsync(() => {
      // Atualiza os valores do formulário para torná-lo válido
      component.maintenanceInfoForm.patchValue({
        maintenanceDescription: 'Oil change',
        customerGuidelines: 'Check oil level monthly',
      });

      tick(); // Aguarda a atualização dos signals

      // Verifica novamente o estado do signal computado
      const currentState = component.formState();
      expect(currentState.isValid).toBeTrue();
      expect(currentState.formData).toEqual({
        maintenanceDescription: 'Oil change',
        customerGuidelines: 'Check oil level monthly',
      });
    }));
  });
});
