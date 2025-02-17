
import { Pipe, PipeTransform } from '@angular/core';
import { GuidPipe } from './guid.pipe';
import { CurrencyPipe } from './currency.pipe';

@Pipe({
  name: 'dynamic',

})
export class DynamicPipe implements PipeTransform {
  private currencyPipe = new CurrencyPipe();
  private guidpipe = new GuidPipe();

  transform(value: string | null | undefined, pipeName: string | null, ...args: any[]): any {
    console.log(pipeName)
    switch (pipeName) {
      case 'currency':
        console.log("fdp")
        return this.currencyPipe.transform(value);
      case 'guid':
        return this.guidpipe.transform(value);
      default:
        return value;
    }
  }

}
