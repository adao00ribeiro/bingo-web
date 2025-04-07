
import { Pipe, PipeTransform } from '@angular/core';
import { GuidPipe } from './guid.pipe';
import { CurrencyPipe } from './currency.pipe';
import { DateTimePipe } from './date-time.pipe';

@Pipe({
  name: 'dynamic',

})
export class DynamicPipe implements PipeTransform {
  private currencyPipe = new CurrencyPipe();
  private guidpipe = new GuidPipe();
  private dateTime = new DateTimePipe();

  transform(value: string | null | undefined, pipeName: string | null, ...args: any[]): any {

    switch (pipeName) {
      case 'currency':
        return this.currencyPipe.transform(value);
      case 'guid':
        return this.guidpipe.transform(value);
      case 'dateTime':
        return this.dateTime.transform(value);
      default:
        return value;
    }
  }

}
