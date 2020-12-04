import {Pipe, PipeTransform} from '@angular/core';
@Pipe ({
   name : 'percentage'
})
export class PercentagePipe implements PipeTransform {
   transform(val: number): number {
       if (val < -5) { return 0; }
       if (val > 5) { return 100; }
       return (val + 5) * 10;
   }
}
