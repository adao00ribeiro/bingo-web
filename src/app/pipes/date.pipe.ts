import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date',
})
export class DatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string | null {
    if (!value) return null;

    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() retorna de 0 a 11
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
}
