import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user.interface';

interface LoginRequest {
  documento: string;
  contrasena: string;
}

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    documento: string;
    nombres: string;
    apellidos: string;
    rol: string;
    rol_id: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = '/api';

  constructor(private http: HttpClient) {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(documento: string, contrasena: string): Observable<boolean> {
    const loginData: LoginRequest = { documento, contrasena };
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, loginData)
      .pipe(
        map(response => {
          if (response.token && response.user) {
            // Transform API user to our User interface
            const user: User = {
              id: parseInt(response.user.id),
              username: response.user.documento,
              email: `${response.user.nombres.toLowerCase()}.${response.user.apellidos.toLowerCase()}@clinic.com`,
              role: this.mapRole(response.user.rol)
            };

            // Store user and token
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('token', response.token);
            this.currentUserSubject.next(user);
            
            return true;
          }
          return false;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return this.currentUserSubject.value !== null && !!token;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private mapRole(apiRole: string): 'admin' | 'doctor' | 'recepcion' {
    switch (apiRole.toLowerCase()) {
      case 'administrador':
        return 'admin';
      case 'doctor':
      case 'médico':
        return 'doctor';
      case 'recepcionista':
      case 'recepcion':
        return 'recepcion';
      default:
        return 'recepcion';
    }
  }
}