import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'calculator-button',
  imports: [],
  templateUrl: './calculator-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'border-r border-b border-indigo-400',
    '[class.w-2/4]': 'isDoubleSize()',
    '[class.w-1/4]': '!isDoubleSize()',
    '[class.is-command]': 'isCommand()',
  },
})
export class CalculatorButtonComponent {
  isPressed = signal(false);
  onClick = output<string>();

  contentValue = viewChild<ElementRef<HTMLButtonElement>>('button');

  isCommand = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });

  isDoubleSize = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });

  // @HostBinding('.is-command') get commandStyle() {
  //   return this.isCommand();
  // }

  // @HostBinding('class.w-2/4') get doubleSizeStyle() {
  //   return this.isDoubleSize();
  // }

  handleClick() {
    if (!this.contentValue()?.nativeElement) return;

    const innerHtml = this.contentValue()!.nativeElement.innerText;

    this.onClick.emit(innerHtml.trim());
  }

  keyboardPressedStyle(key: string) {
    if (!this.contentValue) return;

    const value = this.contentValue()!.nativeElement.innerText;

    if (value !== key) return;

    this.isPressed.set(true);
    setTimeout(() => this.isPressed.set(false), 100);
  }
}
