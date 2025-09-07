import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { HeaderComponent } from './app/components/header/header.component';
import { AuthService } from './app/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    <div class="app-container">
      <app-header *ngIf="showHeader"></app-header>
      <main [class]="showHeader ? 'main-content' : ''">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class App {
  showHeader = false;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe(user => {
      this.showHeader = !!user;
    });

    // Redirect authenticated users to dashboard
    this.router.events.subscribe(() => {
      if (this.router.url === '/login' && this.authService.isAuthenticated()) {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes)
  ]
}).catch(err => console.error(err));