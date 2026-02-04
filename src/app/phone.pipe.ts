import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(rawNum:string) {
    rawNum = "+1"+ rawNum;
    const areaCodeStr = rawNum.slice(2,5);
    const midSectionStr = rawNum.slice(5,8);
    const lastSectionStr = rawNum.slice(8);

    return `(${areaCodeStr})${midSectionStr}-${lastSectionStr}`;
  }

}
 