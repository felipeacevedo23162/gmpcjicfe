import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { PatientService } from '../../services/patient.service';
import { Appointment } from '../../models/appointment.interface';
import { Patient } from '../../models/patient.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="row mb-4">
        <div class="col">
          <h2 class="text-primary fw-bold">
            <i class="fas fa-tachometer-alt me-2"></i>
            Dashboard
          </h2>
          <p class="text-muted">Resumen del sistema de gestión médica</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card card-custom bg-primary text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title">Citas de Hoy</h6>
                  <h3 class="mb-0">{{ todayAppointments.length }}</h3>
                </div>
                <i class="fas fa-calendar-day fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card card-custom bg-success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title">Total Pacientes</h6>
                  <h3 class="mb-0">{{ totalPatients }}</h3>
                </div>
                <i class="fas fa-users fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card card-custom bg-warning text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title">Citas Pendientes</h6>
                  <h3 class="mb-0">{{ pendingAppointments }}</h3>
                </div>
                <i class="fas fa-clock fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card card-custom bg-info text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title">Total Citas</h6>
                  <h3 class="mb-0">{{ totalAppointments }}</h3>
                </div>
                <i class="fas fa-calendar-alt fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="row mb-4">
        <div class="col">
          <div class="card card-custom">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="fas fa-bolt me-2"></i>
                Acciones Rápidas
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-4 mb-3">
                  <a routerLink="/appointments/new" class="btn btn-primary btn-custom w-100">
                    <i class="fas fa-plus me-2"></i>
                    Nueva Cita
                  </a>
                </div>
                <div class="col-md-4 mb-3">
                  <a routerLink="/patients/new" class="btn btn-success btn-custom w-100">
                    <i class="fas fa-user-plus me-2"></i>
                    Nuevo Paciente
                  </a>
                </div>
                <div class="col-md-4 mb-3">
                  <a routerLink="/appointments" class="btn btn-info btn-custom w-100">
                    <i class="fas fa-calendar-alt me-2"></i>
                    Ver Todas las Citas
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Today's Appointments -->
      <div class="row">
        <div class="col">
          <div class="card card-custom">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="fas fa-calendar-day me-2"></i>
                Citas de Hoy
              </h5>
            </div>
            <div class="card-body">
              <div *ngIf="todayAppointments.length === 0" class="text-center py-4 text-muted">
                <i class="fas fa-calendar-times fa-3x mb-3"></i>
                <p>No hay citas programadas para hoy</p>
              </div>
              <div *ngIf="todayAppointments.length > 0">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Hora</th>
                        <th>Paciente</th>
                        <th>Motivo</th>
                        <th>Estado</th>
                        <th>Doctor</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let appointment of todayAppointments">
                        <td><strong>{{ appointment.hora }}</strong></td>
                        <td>{{ appointment.pacienteNombre }}</td>
                        <td>{{ appointment.motivo }}</td>
                        <td>
                          <span class="badge badge-custom" [class]="getStatusClass(appointment.estado)">
                            {{ appointment.estado | titlecase }}
                          </span>
                        </td>
                        <td>{{ appointment.doctor }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  todayAppointments: Appointment[] = [];
  totalPatients = 0;
  totalAppointments = 0;
  pendingAppointments = 0;

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    const today = new Date().toISOString().split('T')[0];
    
    this.appointmentService.getAppointments().subscribe(appointments => {
      this.totalAppointments = appointments.length;
      this.pendingAppointments = appointments.filter(a => a.estado === 'pendiente').length;
      this.todayAppointments = appointments.filter(a => a.fecha === today);
    });

    this.patientService.getPatients().subscribe(patients => {
      this.totalPatients = patients.length;
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmada': return 'bg-success';
      case 'pendiente': return 'bg-warning';
      case 'completada': return 'bg-info';
      case 'cancelada': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}