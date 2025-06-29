import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string | null {
    if (!value) return null;
    const date = new Date(value);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
