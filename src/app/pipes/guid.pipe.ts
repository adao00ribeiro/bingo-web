import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'guid',

})
export class GuidPipe implements PipeTransform {
  private readonly guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  transform(value: string | null | undefined): string | null | undefined {
    if (!value || !this.guidRegex.test(value)) {
      return null; // Retorna null se não for um GUID válido
    }
    return value.split('-')[0]; // Retorna os primeiros 8 caracteres
  }

}
