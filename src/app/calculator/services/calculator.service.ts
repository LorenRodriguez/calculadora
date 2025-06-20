import { Injectable, signal } from '@angular/core';

const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const operators = ['+', '-', '*', '/', 'x', '÷'];
const specialsOperators = ['+/-', '%', '.', '=', 'c', 'Backspace'];

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  resultText = signal('0');
  subResultText = signal('0');
  lastOperator = signal('+');

  constructNumber(value: string): void {
    if (![...numbers, ...operators, ...specialsOperators].includes(value))
      return;

    if (value === '=') {
      this.calculateResult();
      return;
    }

    if (value === 'c') {
      this.resultText.set('0');
      this.subResultText.set('0');
      this.lastOperator.set('+');
      return;
    }

    if (value === 'Backspace') {
      if (this.resultText() === '0') return;
      if (this.resultText().includes('-') && this.resultText().length === 2) {
        this.resultText.set('0');
        return;
      }

      if (this.resultText().length === 1) {
        this.resultText.set('0');
        return;
      }

      this.resultText.update((v) => v.slice(0, -1));
      return;
    }

    // aplicar operadores
    if (operators.includes(value)) {
      //this.calculateResult();
      this.lastOperator.set(value);
      this.subResultText.set(this.resultText());
      this.resultText.set('0');
      return;
    }

    // limitar numero de caracteres
    if (this.resultText().length >= 10) {
      return;
    }

    // validar punto decimal
    if (value === '.' && !this.resultText().includes('.')) {
      if (this.resultText() === '0' || this.resultText() === '') {
        this.resultText.set('0.');
        return;
      }
      this.resultText.update((text) => text + '.');
      return;
    }

    // manejo del 0 inicial
    if (
      this.resultText() === '0' &&
      (value === '0' || this.resultText() === '-0')
    )
      return;

    //cambiar signo
    if (value === '+/-') {
      if (this.resultText().includes('-')) {
        this.resultText.update((text) => text.slice(1));
        return;
      }

      this.resultText.update((text) => '-' + text);
      return;
    }

    //numeros
    if (numbers.includes(value)) {
      if (this.resultText() === '0') {
        this.resultText.set(value);
        return;
      }
      if (this.resultText() === '-0') {
        this.resultText.set('-' + value);
        return;
      }

      this.resultText.update((text) => text + value);
      return;
    }
  }

  calculateResult() {
    const number1 = parseFloat(this.subResultText());
    const number2 = parseFloat(this.resultText());

    let result = 0;

    switch (this.lastOperator()) {
      case '+':
        result = number1 + number2;
        break;
      case '-':
        result = number1 - number2;
        break;
      case '*':
      case 'x':
        result = number1 * number2;
        break;
      case '/':
      case '÷':
        result = number1 / number2;
        break;
    }
    this.resultText.set(result.toString());
    this.subResultText.set('0');
  }
}
