import { Directive, HostBinding, Input, signal, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements AfterViewInit {
  private readonly _revealed = signal(false);
  private _delay = 0;

  @Input('appReveal') set delay(val: number) {
    this._delay = val;
  }

  @HostBinding('class.revealed') get revealed() {
    return this._revealed();
  }

  ngAfterViewInit() {
    setTimeout(() => this._revealed.set(true), this._delay);
  }
}
