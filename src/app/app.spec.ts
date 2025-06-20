import { ElementRef, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let compiled: HTMLElement;
  let app: App;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    app = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    expect(app.title).toEqual('calculadoraApp');
  });

  it('should render router-outlet', () => {
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });

  it('should render router-outlet wrapped css class', () => {
    const divElement = compiled.querySelector('div');
    const mustHaveClass =
      'min-w-screen min-h-screen bg-slate-600 flex items-center justify-center px-5 py-5'.split(
        ' '
      );

    expect(divElement).not.toBeNull();

    const divClass = divElement?.classList.value.split(' ');
    mustHaveClass.forEach((className) => {
      expect(divClass).toContain(className);
    });
  });

  it('should contain the buy me a beer link', () => {
    const linkElement = compiled.querySelector('a');
    const href = linkElement?.getAttribute('href');

    expect(linkElement).not.toBeNull();

    expect(linkElement?.title).toBe('Buy me a beer');
    expect(href).toBe('https://www.buymeacoffee.com/scottwindon');
  });
});
