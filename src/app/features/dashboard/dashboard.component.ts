import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../core/services/client.service';
import { Client } from '../../core/models/client.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private clientService = inject(ClientService);
  
  clientsSig = signal<Client[]>([]);

  totalClients = computed(() => this.clientsSig().length);
  activeClients = computed(() => this.clientsSig().filter(c => c.status === 'active').length);
  inactiveClients = computed(() => this.clientsSig().filter(c => c.status === 'inactive').length);
  
  recentClients = computed(() => {
    // Sort by createdAt desc if available, assumed already sorted from service but let's take slice
    return this.clientsSig().slice(0, 5);
  });

  ngOnInit() {
    this.clientService.getClients().subscribe(clients => {
      this.clientsSig.set(clients);
    });
  }
}
