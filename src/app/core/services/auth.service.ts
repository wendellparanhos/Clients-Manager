import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

// Mock User Interface matching previous Firebase user
interface MockUser {
    uid: string;
    email: string;
    displayName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private readonly STORAGE_KEY = 'mock_auth_user';
  
  // Signal to track current user state
  currentUserSig = signal<MockUser | null | undefined>(undefined);
  
  constructor() {
    // Check local storage on init
    const storedUser = localStorage.getItem(this.STORAGE_KEY);
    if (storedUser) {
      this.currentUserSig.set(JSON.parse(storedUser));
    } else {
      this.currentUserSig.set(null);
    }
  }

  register(email: string, username: string, password: string): Observable<void> {
    // Simulate API delay
    return of(void 0).pipe(
        delay(800),
        tap(() => {
            // Check if user already exists (simple mock check)
            if (email === 'error@example.com') {
                throw { code: 'auth/email-already-in-use' };
            }
            
            const newUser: MockUser = {
                uid: 'mock-uid-' + Date.now(),
                email,
                displayName: username
            };
            
            this.loginSuccess(newUser);
        })
    );
  }

  login(email: string, password: string): Observable<void> {
    return of(void 0).pipe(
        delay(800),
        tap(() => {
            // Mock validation
            if (password.length < 6) {
                throw { code: 'auth/wrong-password' };
            }
            
            const user: MockUser = {
                uid: 'mock-uid-123',
                email,
                displayName: 'Mock User'
            };
            
            this.loginSuccess(user);
        })
    );
  }

  logout(): Observable<void> {
    return of(void 0).pipe(
        delay(300),
        tap(() => {
            localStorage.removeItem(this.STORAGE_KEY);
            this.currentUserSig.set(null);
            this.router.navigate(['/login']);
        })
    );
  }

  private loginSuccess(user: MockUser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      this.currentUserSig.set(user);
  }
}
