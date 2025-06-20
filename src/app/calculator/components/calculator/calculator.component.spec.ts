import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorComponent } from './calculator.component';
import { CalculatorService } from '@/calculator/services/calculator.service';
import { By } from '@angular/platform-browser';
import { CalculatorButtonComponent } from '../calculator-button/calculator-button.component';

class MockCalculatorService {
  resultText = jasmine.createSpy('resultText').and.returnValue('100');
  subResultText = jasmine.createSpy('subResultText').and.returnValue('0');
  lastOperator = jasmine.createSpy('lastOperator').and.returnValue('+');

  constructNumber = jasmine.createSpy('constructNumber');
}

describe('CalculatorComponent', () => {
  let fixture: ComponentFixture<CalculatorComponent>;
  let component: CalculatorComponent;
  let compiled: HTMLElement;
  let mockCalculateService: MockCalculatorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatorComponent],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: CalculatorService,
          useClass: MockCalculatorService,
        },
      ],
    }).compileComponents();

    mockCalculateService = TestBed.inject(
      CalculatorService
    ) as unknown as MockCalculatorService;

    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;

    //fixture.detectChanges();
  });

  it('should create the component', () => {
    console.log(compiled);
    expect(component).toBeTruthy();
  });

  it('Should have the current getters', () => {
    expect(component.resultText()).toBe('100');
    expect(component.subResultText()).toBe('0');
    expect(component.lastOperator()).toBe('+');
  });

  it('Should display proper calculation values', () => {
    mockCalculateService.resultText.and.returnValue('200');
    mockCalculateService.subResultText.and.returnValue('45');
    mockCalculateService.lastOperator.and.returnValue('*');
    fixture.detectChanges();

    expect(compiled.querySelector('span')?.innerText).toBe('45 *');

    expect(component.resultText()).toBe('200');
    expect(component.subResultText()).toBe('45');
    expect(component.lastOperator()).toBe('*');
  });

  it('should have 19 calculator-button components', () => {
    expect(component.calculatorButtons()).toBeTruthy();
    expect(component.calculatorButtons().length).toBe(19);
  });

  it('should have 19 calculator-button with content projection', () => {
    const buttons = compiled.querySelectorAll('calculator-button');
    expect(buttons.length).toBe(19);

    // by directives
    // const buttonsByDirective = fixture.debugElement.queryAll(
    //   By.directive(CalculatorButtonComponent)
    // );
    //expect(buttonsByDirective.length).toBe(19);

    expect(buttons[0].textContent!.trim()).toBe('c');
    expect(buttons[1].textContent!.trim()).toBe('+/-');
  });

  it('should handle keyboard events correctly', () => {
    const eventEnter = new KeyboardEvent('keyup', { key: 'Enter' });
    document.dispatchEvent(eventEnter);

    expect(mockCalculateService.constructNumber).toHaveBeenCalledWith('=');

    const eventESC = new KeyboardEvent('keyup', { key: 'Escape' });
    document.dispatchEvent(eventESC);

    expect(mockCalculateService.constructNumber).toHaveBeenCalledWith('c');
  });

  it('should display result text correctly', () => {
    mockCalculateService.resultText.and.returnValue('123');
    mockCalculateService.subResultText.and.returnValue('10');
    mockCalculateService.lastOperator.and.returnValue('-');
    fixture.detectChanges();

    expect(component.resultText()).toBe('123');

    expect(compiled.querySelector('span')!.textContent).toContain('10 -');
  });
});
