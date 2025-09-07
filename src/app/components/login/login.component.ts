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
                    <label for="username" class="form-label">Usuario</label>
                    <div class="input-group">
                      <span class="input-group-text"><i class="fas fa-user"></i></span>
                      <input 
                        type="text" 
                        class="form-control" 
                        id="username"
                        [(ngModel)]="credentials.username"
                        name="username"
                        required
                        placeholder="Ingrese su usuario">
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="password" class="form-label">Contraseña</label>
                    <div class="input-group">
                      <span class="input-group-text"><i class="fas fa-lock"></i></span>
                      <input 
                        type="password" 
                        class="form-control" 
                        id="password"
                        [(ngModel)]="credentials.password"
                        name="password"
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

                <div class="card bg-light mt-4">
                  <div class="card-body p-3">
                    <small class="text-muted">
                      <strong>Usuarios de prueba:</strong><br>
                      • admin / 123456<br>
                      • doctor1 / 123456<br>
                      • recepcion / 123456
                    </small>
                  </div>
                </div>
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
    username: '',
    password: ''
  };
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials.username, this.credentials.password).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.router.navigate(['/appointments']);
        } else {
          this.errorMessage = 'Usuario o contraseña incorrectos';
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Error al iniciar sesión. Intente nuevamente.';
      }
    });
  }
}