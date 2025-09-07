import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Appointment } from '../models/appointment.interface';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
  public appointments$ = this.appointmentsSubject.asObservable();

  // Mock data
  private mockAppointments: Appointment[] = [
    {
      id: 1,
      pacienteId: 1,
      pacienteNombre: 'Juan Pérez',
      fecha: '2025-01-20',
      hora: '09:00',
      motivo: 'Consulta general',
      estado: 'confirmada',
      doctor: 'Dr. Smith',
      notas: 'Paciente refiere dolor de cabeza frecuente'
    },
    {
      id: 2,
      pacienteId: 2,
      pacienteNombre: 'María González',
      fecha: '2025-01-20',
      hora: '10:30',
      motivo: 'Control rutinario',
      estado: 'pendiente',
      doctor: 'Dr. Johnson'
    },
    {
      id: 3,
      pacienteId: 3,
      pacienteNombre: 'Carlos Rodríguez',
      fecha: '2025-01-21',
      hora: '14:00',
      motivo: 'Seguimiento tratamiento',
      estado: 'completada',
      doctor: 'Dr. Smith',
      notas: 'Evolución favorable del tratamiento'
    }
  ];

  constructor() {
    this.appointmentsSubject.next(this.mockAppointments);
  }

  getAppointments(): Observable<Appointment[]> {
    return this.appointments$;
  }

  getAppointment(id: number): Appointment | undefined {
    return this.mockAppointments.find(a => a.id === id);
  }

  addAppointment(appointment: Omit<Appointment, 'id'>): void {
    const newAppointment = {
      ...appointment,
      id: Math.max(...this.mockAppointments.map(a => a.id)) + 1
    };
    this.mockAppointments.push(newAppointment);
    this.appointmentsSubject.next([...this.mockAppointments]);
  }

  updateAppointment(id: number, appointment: Partial<Appointment>): void {
    const index = this.mockAppointments.findIndex(a => a.id === id);
    if (index !== -1) {
      this.mockAppointments[index] = { ...this.mockAppointments[index], ...appointment };
      this.appointmentsSubject.next([...this.mockAppointments]);
    }
  }

  deleteAppointment(id: number): void {
    this.mockAppointments = this.mockAppointments.filter(a => a.id !== id);
    this.appointmentsSubject.next([...this.mockAppointments]);
  }

  getAppointmentsByDate(date: string): Appointment[] {
    return this.mockAppointments.filter(a => a.fecha === date);
  }
}