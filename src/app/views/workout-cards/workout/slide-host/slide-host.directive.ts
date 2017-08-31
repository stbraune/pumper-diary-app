import { Directive, Input, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[slide-host]'
})
export class SlideHostDirective {
  @Input('slide-host')
  public data: any;

  public constructor(
    public viewContainerRef: ViewContainerRef
  ) { }
}
