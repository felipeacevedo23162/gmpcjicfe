import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Mock users for demo
  private mockUsers: User[] = [
    { id: 1, username: 'admin', email: 'admin@clinic.com', role: 'admin' },
    { id: 2, username: 'doctor1', email: 'doctor@clinic.com', role: 'doctor' },
    { id: 3, username: 'recepcion', email: 'recepcion@clinic.com', role: 'recepcion' }
  ];

  constructor() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(username: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      // Mock authentication - in real app, this would be an HTTP call
      setTimeout(() => {
        const user = this.mockUsers.find(u => u.username === username);
        if (user && password === '123456') { // Mock password
          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}