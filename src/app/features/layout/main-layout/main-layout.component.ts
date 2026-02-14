import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isSidebarOpen = false; // Default closed on mobile, open on desktop via CSS checking
  pageTitle = 'Dashboard';
  
  // Use Signal from AuthService
  currentUser = this.authService.currentUserSig;
  userEmail = computed(() => this.currentUser()?.email ?? '');

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
        // Simple title setting based on URL logic
        if (event.url.includes('dashboard')) this.pageTitle = 'Dashboard';
        else if (event.url.includes('clients/new')) this.pageTitle = 'Add Client';
        else if (event.url.includes('clients/edit')) this.pageTitle = 'Edit Client';
        else if (event.url.includes('clients')) this.pageTitle = 'Clients';
        
        // Close sidebar on navigation on mobile
        this.isSidebarOpen = false;
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.authService.logout().subscribe();
  }
}
