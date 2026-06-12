import { Pipe, PipeTransform } from '@angular/core';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

@Pipe({
  name: 'dateFormat',
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date | null | undefined, pattern: string = 'PP'): string {
    if (!value) return '';
    try {
      const date = typeof value === 'string' ? parseISO(value) : value;
      return format(date, pattern, { locale: es });
    } catch {
      return String(value);
    }
  }
}
