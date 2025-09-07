import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container d-flex align-items-center justify-content-center">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-4">
            <div class="card login-card">
              <div class="card-body p-4">
                <div class="text-center mb-4">
                  <i class="fas fa-clinic-medical text-primary mb-3" style="font-size: 3rem;"></i>
                  <h4 class="card-title">Iniciar Sesión</h4>
                  <p class="text-muted">Sistema de Gestión Médica</p>
                </div>

                <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
                  <div class="mb-3">
                    <label for="documento" class="form-label">Documento</label>
                    <div class="input-group">
                      <span class="input-group-text"><i class="fas fa-id-card"></i></span>
                      <input 
                        type="text" 
                        class="form-control" 
                        id="documento"
                        [(ngModel)]="credentials.documento"
                        name="documento"
                        required
                        placeholder="Ingrese su documento">
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="contrasena" class="form-label">Contraseña</label>
                    <div class="input-group">
                      <span class="input-group-text"><i class="fas fa-lock"></i></span>
                      <input 
                        type="password" 
                        class="form-control" 
                        id="contrasena"
                        [(ngModel)]="credentials.contrasena"
                        name="contrasena"
                        required
                        placeholder="Ingrese su contraseña">
                    </div>
                  </div>

                  <div class="d-grid mb-3">
                    <button 
                      type="submit" 
                      class="btn btn-primary btn-custom"
                      [disabled]="isLoading || !loginForm.valid">
                      <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                      {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
                    </button>
                  </div>

                  <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-circle me-2"></i>
                    {{ errorMessage }}
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  credentials = {
    documento: '',
    contrasena: ''
  };
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials.documento, this.credentials.contrasena).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Documento o contraseña incorrectos';
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Error al conectar con el servidor. Verifique que la API esté funcionando.';
      }
    });
  }
}