import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Patient } from '../models/patient.interface';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private patientsSubject = new BehaviorSubject<Patient[]>([]);
  public patients$ = this.patientsSubject.asObservable();

  // Mock data
  private mockPatients: Patient[] = [
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      telefono: '555-0101',
      email: 'juan.perez@email.com',
      fechaNacimiento: '1985-03-15',
      direccion: 'Calle 123 #45-67',
      cedula: '12345678',
      genero: 'M'
    },
    {
      id: 2,
      nombre: 'María',
      apellido: 'González',
      telefono: '555-0102',
      email: 'maria.gonzalez@email.com',
      fechaNacimiento: '1990-07-22',
      direccion: 'Carrera 45 #23-89',
      cedula: '87654321',
      genero: 'F'
    },
    {
      id: 3,
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      telefono: '555-0103',
      email: 'carlos.rodriguez@email.com',
      fechaNacimiento: '1978-11-08',
      direccion: 'Avenida 12 #34-56',
      cedula: '11223344',
      genero: 'M'
    }
  ];

  constructor() {
    this.patientsSubject.next(this.mockPatients);
  }

  getPatients(): Observable<Patient[]> {
    return this.patients$;
  }

  getPatient(id: number): Patient | undefined {
    return this.mockPatients.find(p => p.id === id);
  }

  addPatient(patient: Omit<Patient, 'id'>): void {
    const newPatient = {
      ...patient,
      id: Math.max(...this.mockPatients.map(p => p.id)) + 1
    };
    this.mockPatients.push(newPatient);
    this.patientsSubject.next([...this.mockPatients]);
  }

  updatePatient(id: number, patient: Partial<Patient>): void {
    const index = this.mockPatients.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockPatients[index] = { ...this.mockPatients[index], ...patient };
      this.patientsSubject.next([...this.mockPatients]);
    }
  }

  deletePatient(id: number): void {
    this.mockPatients = this.mockPatients.filter(p => p.id !== id);
    this.patientsSubject.next([...this.mockPatients]);
  }
}