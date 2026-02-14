import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models/client.model';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.css'
})
export class ClientDetailComponent implements OnInit {
  private clientService = inject(ClientService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  clientSig = signal<Client | undefined>(undefined);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clientService.getClient(id).subscribe(client => {
        if (client) {
          this.clientSig.set(client);
        } else {
            this.router.navigate(['/clients']);
        }
      });
    }
  }

  deleteClient() {
    const client = this.clientSig();
    if (client && confirm('Are you sure you want to delete this client?')) {
        this.clientService.deleteClient(client.id!).subscribe(() => {
            this.router.navigate(['/clients']);
        });
    }
  }
}
