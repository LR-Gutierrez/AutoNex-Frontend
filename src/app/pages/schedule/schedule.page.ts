import { Component, OnInit } from '@angular/core';

interface CalendarDay {
  number: number;
  selected: boolean;
  today: boolean;
}

interface ScheduleEvent {
  time: string;
  title: string;
  location: string;
  date: string;
  duration: string;
  active: boolean;
  completed: boolean;
  isLast: boolean;
}

@Component({
  standalone: false,
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  selectedMonth = 'January';
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: CalendarDay[] = [];
  dayEvents: ScheduleEvent[] = [];

  constructor() {}

  ngOnInit() {
    this.generateCalendar();
    this.loadDayEvents();
  }

  generateCalendar() {
    // Generar días del calendario (ejemplo para enero 2025)
    const daysInMonth = 31;
    const firstDayOfWeek = 3; // Miércoles (0 = Domingo)

    // Agregar días vacíos al inicio
    for (let i = 0; i < firstDayOfWeek; i++) {
      this.calendarDays.push({
        number: 0,
        selected: false,
        today: false,
      });
    }

    // Agregar días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      this.calendarDays.push({
        number: day,
        selected: day === 3, // Día 3 seleccionado por defecto
        today: day === 3,
      });
    }
  }

  selectDay(day: CalendarDay) {
    if (!day.number) return;

    // Deseleccionar todos los días
    this.calendarDays.forEach((d) => (d.selected = false));

    // Seleccionar el día clickeado
    day.selected = true;

    // Cargar eventos del día (aquí podrías hacer una consulta real)
    this.loadDayEvents();
  }

  loadDayEvents() {
    // Datos de ejemplo
    this.dayEvents = [
      {
        time: '08:00 AM',
        title: 'Team meeting',
        location: 'Meeting room level 9',
        date: 'January 3, 2025',
        duration: '08:00 - 09:00 AM',
        active: false,
        completed: true,
        isLast: false,
      },
      {
        time: '09:00 AM',
        title: 'Present a plan',
        location: 'Meeting room level 9',
        date: 'January 3, 2025',
        duration: '09:00 - 10:00 AM',
        active: true,
        completed: false,
        isLast: false,
      },
      {
        time: '10:00 AM',
        title: 'Meeting summary',
        location: 'Meeting room level 9',
        date: 'January 3, 2025',
        duration: '10:00 - 11:00 AM',
        active: false,
        completed: false,
        isLast: false,
      },
      {
        time: '11:00 AM',
        title: 'Design first draft',
        location: 'Meeting room level 9',
        date: 'January 3, 2025',
        duration: '11:00 - 12:00 PM',
        active: false,
        completed: false,
        isLast: true,
      },
    ];
  }
}
