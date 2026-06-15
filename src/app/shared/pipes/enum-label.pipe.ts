import { Pipe, PipeTransform } from '@angular/core';

const LABEL_MAP: Record<string, string> = {
  Open: 'Abierta',
  InProgress: 'En Progreso',
  Completed: 'Completada',
  Cancelled: 'Cancelada',
  Income: 'Ingreso',
  Expense: 'Egreso',
  Oil: 'Aceite',
  SparkPlug: 'Bujía',
  Coolant: 'Refrigerante',
  Grease: 'Grasa',
  BrakeFluid: 'Líquido de Frenos',
  Other: 'Otro',
  Available: 'Disponible',
  Damaged: 'Dañado',
  Lost: 'Perdido',
  Pending: 'Pendiente',
  Sent: 'Enviado',
  Failed: 'Falló',
  In: 'Entrada',
  Out: 'Salida',
  Jack: 'Gato',
  Wrench: 'Llave',
  Ratchet: 'Matraca',
  Screwdriver: 'Destornillador',
  Hammer: 'Martillo',
  Services: 'Servicios',
  Suppliers: 'Proveedores',
  Rent: 'Alquiler',
  Payroll: 'Nómina',
  Utilities: 'Servicios Públicos',
};

@Pipe({
  name: 'enumLabel',
  standalone: true,
})
export class EnumLabelPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return LABEL_MAP[value] ?? value;
  }
}
