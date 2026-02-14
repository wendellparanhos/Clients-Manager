import { inject } from '@angular/core';
import {  CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  const user = authService.currentUserSig();
  
  if (user) {
    return true;
  } else {
    // If signal isn't set yet (initial load might mean undefined), check via behavior or assume routed here properly
    // However in our mock service, construction sets it synchronously from localStorage.
    // If it's explicitly null/undefined, redirect.
    router.navigate(['/login']);
    return false;
  }
};

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  const user = authService.currentUserSig();
  
  if (user) {
    router.navigate(['/dashboard']);
    return false;
  } else {
    return true;
  }
};
