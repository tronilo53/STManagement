import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appScroll]'
})
export class ScrollDirective {

  @Output() scrolled = new EventEmitter<void>();

  constructor() { }

  @HostListener('window:scroll', [])
  public onWindowScroll(): void { this.scrolled.emit() }

}