import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark navbar-custom">
      <div class="container">
        <a class="navbar-brand fw-bold" routerLink="/dashboard">
          <i class="fas fa-clinic-medical me-2"></i>
          Clínica Médica
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/appointments" routerLinkActive="active">
                <i class="fas fa-calendar-alt me-1"></i>
                Citas
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/patients" routerLinkActive="active">
                <i class="fas fa-users me-1"></i>
                Pacientes
              </a>
            </li>
          </ul>
          
          <div class="navbar-nav" *ngIf="currentUser">
            <div class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="fas fa-user me-1"></i>
                {{ currentUser.username }}
                <span class="badge bg-light text-primary ms-2">{{ currentUser.role }}</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="#"><i class="fas fa-user-cog me-2"></i>Perfil</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" (click)="logout()"><i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}