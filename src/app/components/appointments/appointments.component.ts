import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { PatientService } from '../../services/patient.service';
import { Appointment } from '../../models/appointment.interface';
import { Patient } from '../../models/patient.interface';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="row mb-4">
        <div class="col">
          <h2 class="text-primary fw-bold">
            <i class="fas fa-calendar-alt me-2"></i>
            Gestión de Citas
          </h2>
          <p class="text-muted">Administra todas las citas médicas</p>
        </div>
        <div class="col-auto">
          <button class="btn btn-primary btn-custom" data-bs-toggle="modal" data-bs-target="#appointmentModal" (click)="openModal()">
            <i class="fas fa-plus me-2"></i>
            Nueva Cita
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="row mb-4">
        <div class="col-md-4">
          <input type="date" class="form-control" [(ngModel)]="filterDate" (change)="filterAppointments()">
        </div>
        <div class="col-md-4">
          <select class="form-select" [(ngModel)]="filterStatus" (change)="filterAppointments()">
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
        <div class="col-md-4">
          <button class="btn btn-outline-secondary" (click)="clearFilters()">
            <i class="fas fa-times me-2"></i>
            Limpiar Filtros
          </button>
        </div>
      </div>

      <!-- Appointments Table -->
      <div class="card card-custom">
        <div class="card-body">
          <div *ngIf="filteredAppointments.length === 0" class="text-center py-4 text-muted">
            <i class="fas fa-calendar-times fa-3x mb-3"></i>
            <p>No se encontraron citas</p>
          </div>
          <div *ngIf="filteredAppointments.length > 0">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead class="table-light">
                  <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Paciente</th>
                    <th>Motivo</th>
                    <th>Doctor</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let appointment of filteredAppointments">
                    <td>{{ formatDate(appointment.fecha) }}</td>
                    <td><strong>{{ appointment.hora }}</strong></td>
                    <td>{{ appointment.pacienteNombre }}</td>
                    <td>{{ appointment.motivo }}</td>
                    <td>{{ appointment.doctor }}</td>
                    <td>
                      <span class="badge badge-custom" [class]="getStatusClass(appointment.estado)">
                        {{ appointment.estado | titlecase }}
                      </span>
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" (click)="editAppointment(appointment)" data-bs-toggle="modal" data-bs-target="#appointmentModal">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" (click)="deleteAppointment(appointment.id)">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Appointment Modal -->
    <div class="modal fade" id="appointmentModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingAppointment ? 'Editar' : 'Nueva' }} Cita</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <form (ngSubmit)="saveAppointment()" #appointmentForm="ngForm">
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Paciente *</label>
                  <select class="form-select" [(ngModel)]="currentAppointment.pacienteId" name="pacienteId" required (change)="onPatientChange()">
                    <option value="">Seleccionar paciente</option>
                    <option *ngFor="let patient of patients" [value]="patient.id">
                      {{ patient.nombre }} {{ patient.apellido }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Fecha *</label>
                  <input type="date" class="form-control" [(ngModel)]="currentAppointment.fecha" name="fecha" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Hora *</label>
                  <input type="time" class="form-control" [(ngModel)]="currentAppointment.hora" name="hora" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Doctor *</label>
                  <select class="form-select" [(ngModel)]="currentAppointment.doctor" name="doctor" required>
                    <option value="">Seleccionar doctor</option>
                    <option value="Dr. Smith">Dr. Smith</option>
                    <option value="Dr. Johnson">Dr. Johnson</option>
                    <option value="Dr. Williams">Dr. Williams</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Estado</label>
                  <select class="form-select" [(ngModel)]="currentAppointment.estado" name="estado">
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
                <div class="col-12 mb-3">
                  <label class="form-label">Motivo *</label>
                  <input type="text" class="form-control" [(ngModel)]="currentAppointment.motivo" name="motivo" required placeholder="Motivo de la consulta">
                </div>
                <div class="col-12 mb-3">
                  <label class="form-label">Notas</label>
                  <textarea class="form-control" [(ngModel)]="currentAppointment.notas" name="notas" rows="3" placeholder="Notas adicionales"></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-primary" [disabled]="!appointmentForm.valid">
                {{ editingAppointment ? 'Actualizar' : 'Crear' }} Cita
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  patients: Patient[] = [];
  filterDate = '';
  filterStatus = '';
  editingAppointment = false;
  currentAppointment: any = this.getEmptyAppointment();

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
    this.loadPatients();
  }

  private loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe(appointments => {
      this.appointments = appointments;
      this.filteredAppointments = appointments;
    });
  }

  private loadPatients(): void {
    this.patientService.getPatients().subscribe(patients => {
      this.patients = patients;
    });
  }

  filterAppointments(): void {
    this.filteredAppointments = this.appointments.filter(appointment => {
      const dateMatch = !this.filterDate || appointment.fecha === this.filterDate;
      const statusMatch = !this.filterStatus || appointment.estado === this.filterStatus;
      return dateMatch && statusMatch;
    });
  }

  clearFilters(): void {
    this.filterDate = '';
    this.filterStatus = '';
    this.filteredAppointments = this.appointments;
  }

  openModal(): void {
    this.editingAppointment = false;
    this.currentAppointment = this.getEmptyAppointment();
  }

  editAppointment(appointment: Appointment): void {
    this.editingAppointment = true;
    this.currentAppointment = { ...appointment };
  }

  saveAppointment(): void {
    if (this.editingAppointment) {
      this.appointmentService.updateAppointment(this.currentAppointment.id, this.currentAppointment);
    } else {
      this.appointmentService.addAppointment(this.currentAppointment);
    }
    this.loadAppointments();
    this.closeModal();
  }

  deleteAppointment(id: number): void {
    if (confirm('¿Está seguro de eliminar esta cita?')) {
      this.appointmentService.deleteAppointment(id);
      this.loadAppointments();
    }
  }

  onPatientChange(): void {
    const patient = this.patients.find(p => p.id === Number(this.currentAppointment.pacienteId));
    if (patient) {
      this.currentAppointment.pacienteNombre = `${patient.nombre} ${patient.apellido}`;
    }
  }

  private getEmptyAppointment(): any {
    return {
      pacienteId: '',
      pacienteNombre: '',
      fecha: '',
      hora: '',
      motivo: '',
      estado: 'pendiente',
      doctor: '',
      notas: ''
    };
  }

  private closeModal(): void {
    const modal = document.getElementById('appointmentModal');
    if (modal) {
      const bsModal = (window as any).bootstrap?.Modal.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
      }
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES');
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