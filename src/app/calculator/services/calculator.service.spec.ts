import { CalculatorService } from '@/calculator/services/calculator.service';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Result } from 'postcss';

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(CalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be created with defaults values', () => {
    expect(service.resultText()).toBe('0');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('+');
  });

  it('should set resultText, subResultText to 0 when C is pressed', () => {
    service.resultText.set('5');
    service.subResultText.set('10');
    service.lastOperator.set('/');

    service.constructNumber('c');

    expect(service.resultText()).toBe('0');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('+');
  });

  it('should update resultText with number input', () => {
    service.constructNumber('1');
    expect(service.resultText()).toBe('1');

    service.constructNumber('2');
    expect(service.resultText()).toBe('12');
  });

  it('should handle operators correctly', () => {
    service.constructNumber('1');
    service.constructNumber('-');

    expect(service.lastOperator()).toBe('-');
    expect(service.subResultText()).toBe('1');
    expect(service.resultText()).toBe('0');
  });

  it('should calculate result correctly for addition', () => {
    service.constructNumber('2');
    service.constructNumber('2');
    service.constructNumber('+');
    service.constructNumber('2');
    service.constructNumber('2');
    service.constructNumber('=');

    expect(service.resultText()).toBe('44');
  });

  it('should calculate result correctly for substraccion', () => {
    service.constructNumber('2');
    service.constructNumber('2');
    service.constructNumber('-');
    service.constructNumber('2');
    service.constructNumber('0');
    service.constructNumber('=');

    expect(service.resultText()).toBe('2');
  });

  it('should calculate result correctly for multiplication', () => {
    service.constructNumber('2');
    service.constructNumber('x');
    service.constructNumber('5');
    service.constructNumber('=');

    expect(service.resultText()).toBe('10');
  });

  it('should calculate result correctly for division', () => {
    service.constructNumber('1');
    service.constructNumber('0');
    service.constructNumber('/');
    service.constructNumber('2');
    service.constructNumber('=');

    expect(service.resultText()).toBe('5');
  });

  it('should handle decimal point correclty', () => {
    service.constructNumber('1');
    service.constructNumber('.');
    service.constructNumber('5');

    expect(service.resultText()).toBe('1.5');

    service.constructNumber('.');

    expect(service.resultText()).toBe('1.5');
  });

  it('should handle decimal point correclty start with 0', () => {
    service.constructNumber('0');
    service.constructNumber('.');
    service.constructNumber('.');
    service.constructNumber('0');

    expect(service.resultText()).toBe('0.0');
  });

  it('should do something', () => {
    service.constructNumber('1');
    service.constructNumber('+/-');
    expect(service.resultText()).toBe('-1');

    service.constructNumber('+/-');
    expect(service.resultText()).toBe('1');
  });

  it('should handle Backspace', () => {
    service.resultText.set('52');
    service.constructNumber('Backspace');
    expect(service.resultText()).toBe('5');

    service.constructNumber('Backspace');
    expect(service.resultText()).toBe('0');
  });

  it('should maxLength correctly', () => {
    for (let i = 0; i < 10; i++) {
      service.constructNumber('1');
    }

    expect(service.resultText().length).toBe(10);
    service.constructNumber('1');
    expect(service.resultText().length).toBe(10);
  });
});
