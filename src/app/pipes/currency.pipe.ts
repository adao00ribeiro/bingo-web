import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency',
})
export class CurrencyPipe implements PipeTransform {

    transform(value: string | number | null | undefined): string | null | undefined {
    // Se o valor for um número (exibição do valor)
    if (typeof value === 'number') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    }

    // Caso contrário, remova formatação de moeda para armazenar o valor
    if (typeof value === 'string') {
      let cleanValue = value.replace(/[^\d,]/g, '');  // Remove caracteres não numéricos
      cleanValue = cleanValue.replace(',', '.');  // Converte a vírgula para ponto
      return parseFloat(cleanValue).toString();  // Retorna o valor como número
    }

    return value;
  }
}
