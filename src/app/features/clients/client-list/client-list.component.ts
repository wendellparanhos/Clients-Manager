import { Component, inject, signal, computed, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models/client.model';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export class ClientListComponent implements OnInit {
  private clientService = inject(ClientService);
  private toastService = inject(ToastService);
  
  clients = signal<Client[]>([]);
  
  searchControl = new FormControl('');
  statusFilterControl = new FormControl('all');
  
  // Convert Observables to Signals for easy use in computed
  searchTerm = toSignal(this.searchControl.valueChanges.pipe(
    debounceTime(300), 
    distinctUntilChanged()
  ), { initialValue: '' });
  
  statusFilter = toSignal(this.statusFilterControl.valueChanges, { initialValue: 'all' });

  // Stats Signals
  totalClients = computed(() => this.clients().length);
  activeClients = computed(() => this.clients().filter(c => c.status === 'active').length);
  inactiveClients = computed(() => this.clients().filter(c => c.status === 'inactive').length);
  newClientsMonth = computed(() => {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return this.clients().filter(c => new Date(c.createdAt) >= monthStart).length;
  });

  filteredClients = computed(() => {
    let result = this.clients();
    const term = this.searchTerm()?.toLowerCase() ?? '';
    const status = this.statusFilter() ?? 'all';

    // Filter by term
    if (term) {
      result = result.filter(c => 
        c.name.toLowerCase().includes(term) || 
        c.email.toLowerCase().includes(term) ||
        c.phone.includes(term)
      );
    }

    // Filter by status
    if (status !== 'all') {
      result = result.filter(c => c.status === status);
    }

    return result;
  });

  totalCount = computed(() => this.clients().length);

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getClients().subscribe(data => {
      this.clients.set(data);
    });
  }

  deleteClient(client: Client) {
    if (confirm(`Tem certeza que deseja excluir ${client.name}?`)) {
      if (client.id) {
        this.clientService.deleteClient(client.id).subscribe(() => {
           this.clients.update(current => current.filter(c => c.id !== client.id));
           this.toastService.success('Cliente Removido', `${client.name} foi excluído com sucesso.`);
        }, () => {
           this.toastService.error('Erro', 'Não foi possível excluir o cliente.');
        });
      }
    }
  }
}
