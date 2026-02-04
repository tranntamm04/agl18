import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numtostring'
})
export class NumtostringPipe implements PipeTransform {

  transform(rawNum:number ,char : any) {
    return rawNum.toLocaleString().split(',').join(char || '.');
  }
}
 