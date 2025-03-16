import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTime',
})
export class DateTimePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string | null {
    if (!value) return null;

    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() retorna de 0 a 11
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }
}
