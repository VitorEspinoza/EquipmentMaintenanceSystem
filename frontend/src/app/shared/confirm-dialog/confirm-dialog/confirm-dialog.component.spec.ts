/* Arquivo: confirm-delete-modal.component.spec.ts
   -------------------------------------------------
   Este é o arquivo de teste corrigido e completo para o ConfirmDeleteModalComponent.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// O componente que estamos testando
import { ConfirmDeleteModalComponent } from './confirm-dialog.component';

// Descreve o conjunto de testes para o ConfirmDeleteModalComponent
describe('ConfirmDeleteModalComponent', () => {
  let component: ConfirmDeleteModalComponent;
  let fixture: ComponentFixture<ConfirmDeleteModalComponent>;
  // Criamos um "mock" (uma simulação) do MatDialogRef
  let mockDialogRef: MatDialogRef<ConfirmDeleteModalComponent>;

  const testData = {
    message: 'Você tem certeza que quer apagar este item?',
  };

  // Bloco que roda antes de cada teste
  beforeEach(async () => {
    // Criamos um spy (espião) no método 'close' para podermos verificar se ele foi chamado
    mockDialogRef = {
      close: jasmine.createSpy('close'),
    } as any;

    await TestBed.configureTestingModule({
      // Como o componente é standalone, nós o importamos diretamente
      imports: [ConfirmDeleteModalComponent, NoopAnimationsModule],
      providers: [
        // Fornecemos o nosso mock do MatDialogRef
        { provide: MatDialogRef, useValue: mockDialogRef },
        // Fornecemos os dados de teste para o MAT_DIALOG_DATA
        { provide: MAT_DIALOG_DATA, useValue: testData },
      ],
    }).compileComponents();

    // Cria o componente
    fixture = TestBed.createComponent(ConfirmDeleteModalComponent);
    component = fixture.componentInstance;
    
    // Dispara a detecção de mudanças para renderizar o template inicial
    fixture.detectChanges();
  });

  // Teste 1: Verifica se o componente foi criado
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Teste 2: Verifica se a mensagem passada via MAT_DIALOG_DATA é exibida
  it('should display the message from MAT_DIALOG_DATA', () => {
    // Usamos `nativeElement` para acessar o elemento do DOM renderizado
    const compiled = fixture.nativeElement as HTMLElement;
    // Procuramos o parágrafo no template e verificamos seu conteúdo
    const messageParagraph = compiled.querySelector('p');
    expect(messageParagraph?.textContent).toContain(testData.message);
  });

  // Teste 3: Verifica se o dialog é fechado com `false` ao chamar o método cancel()
  it('should close the dialog with false when cancel() is called', () => {
    component.cancel();
    // Verificamos se o método `close` do nosso mock foi chamado com o valor `false`
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });

  // Teste 4: Verifica se o dialog é fechado com `true` ao chamar o método confirm()
  it('should close the dialog with true when confirm() is called', () => {
    component.confirm();
    // Verificamos se o método `close` foi chamado com o valor `true`
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });
  
  // Teste 5 (Bônus): Verifica se o clique no botão "Excluir" chama o método confirm()
  it('should call confirm() when the confirm button is clicked', () => {
     // Criamos um espião no método `confirm` do próprio componente
    spyOn(component, 'confirm');

    // Usamos `nativeElement` para encontrar o botão de confirmação e simular um clique
    const confirmButton = fixture.nativeElement.querySelector('button[color="warn"]');
    confirmButton.click();

    // Verificamos se o método `confirm` foi de fato chamado após o clique
    expect(component.confirm).toHaveBeenCalled();
  });
});
