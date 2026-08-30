import { Pipe, PipeTransform } from '@angular/core';

const DIAS_DA_SEMANA: Record<string, string> = {
  MONDAY: 'Segunda-feira',
  TUESDAY: 'Terça-feira',
  WEDNESDAY: 'Quarta-feira',
  THURSDAY: 'Quinta-feira',
  FRIDAY: 'Sexta-feira',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo',
};

@Pipe({
  name: 'diaDaSemana',
  standalone: true,
})
export class DiaDaSemanaPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return DIAS_DA_SEMANA[value] ?? value;
  }
}
