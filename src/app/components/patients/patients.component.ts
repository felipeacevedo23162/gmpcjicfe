import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.interface';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="row mb-4">
        <div class="col">
          <h2 class="text-primary fw-bold">
            <i class="fas fa-users me-2"></i>
            Gestión de Pacientes
          </h2>
          <p class="text-muted">Administra la información de todos los pacientes</p>
        </div>
        <div class="col-auto">
          <button class="btn btn-success btn-custom" data-bs-toggle="modal" data-bs-target="#patientModal" (click)="openModal()">
            <i class="fas fa-user-plus me-2"></i>
            Nuevo Paciente
          </button>
        </div>
      </div>

      <!-- Search -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="input-group">
            <span class="input-group-text"><i class="fas fa-search"></i></span>
            <input type="text" class="form-control" [(ngModel)]="searchTerm" (input)="filterPatients()" placeholder="Buscar paciente...">
          </div>
        </div>
      </div>

      <!-- Patients Table -->
      <div class="card card-custom">
        <div class="card-body">
          <div *ngIf="filteredPatients.length === 0" class="text-center py-4 text-muted">
            <i class="fas fa-user-times fa-3x mb-3"></i>
            <p>No se encontraron pacientes</p>
          </div>
          <div *ngIf="filteredPatients.length > 0">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead class="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Cédula</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Fecha Nacimiento</th>
                    <th>Género</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let patient of filteredPatients">
                    <td><strong>{{ patient.nombre }} {{ patient.apellido }}</strong></td>
                    <td>{{ patient.cedula }}</td>
                    <td>{{ patient.telefono }}</td>
                    <td>{{ patient.email }}</td>
                    <td>{{ formatDate(patient.fechaNacimiento) }}</td>
                    <td>
                      <span class="badge" [class]="patient.genero === 'M' ? 'bg-primary' : 'bg-info'">
                        {{ patient.genero === 'M' ? 'Masculino' : 'Femenino' }}
                      </span>
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" (click)="editPatient(patient)" data-bs-toggle="modal" data-bs-target="#patientModal">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" (click)="deletePatient(patient.id)">
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

    <!-- Patient Modal -->
    <div class="modal fade" id="patientModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingPatient ? 'Editar' : 'Nuevo' }} Paciente</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <form (ngSubmit)="savePatient()" #patientForm="ngForm">
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Nombre *</label>
                  <input type="text" class="form-control" [(ngModel)]="currentPatient.nombre" name="nombre" required placeholder="Nombre del paciente">
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Apellido *</label>
                  <input type="text" class="form-control" [(ngModel)]="currentPatient.apellido" name="apellido" required placeholder="Apellido del paciente">
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Cédula *</label>
                  <input type="text" class="form-control" [(ngModel)]="currentPatient.cedula" name="cedula" required placeholder="Número de cédula">
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Género *</label>
                  <select class="form-select" [(ngModel)]="currentPatient.genero" name="genero" required>
                    <option value="">Seleccionar género</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Fecha de Nacimiento *</label>
                  <input type="date" class="form-control" [(ngModel)]="currentPatient.fechaNacimiento" name="fechaNacimiento" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Teléfono *</label>
                  <input type="tel" class="form-control" [(ngModel)]="currentPatient.telefono" name="telefono" required placeholder="Número de teléfono">
                </div>
                <div class="col-md-12 mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" [(ngModel)]="currentPatient.email" name="email" placeholder="Correo electrónico">
                </div>
                <div class="col-12 mb-3">
                  <label class="form-label">Dirección</label>
                  <textarea class="form-control" [(ngModel)]="currentPatient.direccion" name="direccion" rows="3" placeholder="Dirección completa"></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-success" [disabled]="!patientForm.valid">
                {{ editingPatient ? 'Actualizar' : 'Crear' }} Paciente
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchTerm = '';
  editingPatient = false;
  currentPatient: any = this.getEmptyPatient();

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  private loadPatients(): void {
    this.patientService.getPatients().subscribe(patients => {
      this.patients = patients;
      this.filteredPatients = patients;
    });
  }

  filterPatients(): void {
    if (!this.searchTerm) {
      this.filteredPatients = this.patients;
    } else {
      this.filteredPatients = this.patients.filter(patient =>
        patient.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        patient.apellido.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        patient.cedula.includes(this.searchTerm) ||
        patient.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  openModal(): void {
    this.editingPatient = false;
    this.currentPatient = this.getEmptyPatient();
  }

  editPatient(patient: Patient): void {
    this.editingPatient = true;
    this.currentPatient = { ...patient };
  }

  savePatient(): void {
    if (this.editingPatient) {
      this.patientService.updatePatient(this.currentPatient.id, this.currentPatient);
    } else {
      this.patientService.addPatient(this.currentPatient);
    }
    this.loadPatients();
    this.closeModal();
  }

  deletePatient(id: number): void {
    if (confirm('¿Está seguro de eliminar este paciente?')) {
      this.patientService.deletePatient(id);
      this.loadPatients();
    }
  }

  private getEmptyPatient(): any {
    return {
      nombre: '',
      apellido: '',
      telefono: '',
      email: '',
      fechaNacimiento: '',
      direccion: '',
      cedula: '',
      genero: ''
    };
  }

  private closeModal(): void {
    const modal = document.getElementById('patientModal');
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
}