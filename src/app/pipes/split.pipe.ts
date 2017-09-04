import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'split'
})
export class SplitPipe implements PipeTransform {
  public transform(value: any, separator?: string) {
    return value && value.split ? value.split(separator) : value;
  }
}
