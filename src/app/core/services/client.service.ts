import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Client } from '../models/client.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private authService = inject(AuthService);
  private readonly STORAGE_KEY = 'mock_clients_db';

  constructor() {
    this.initializeDemoData();
  }

  private initializeDemoData() {
    const existingClients = this.getStoredClients();
    
    // Only initialize if there are no clients yet
    if (existingClients.length === 0) {
      const demoClients: Client[] = [
        {
          id: 'client-1001',
          userId: 'demo-user',
          name: 'Ana Silva',
          email: 'ana.silva@email.com',
          phone: '(11) 98765-4321',
          cpf: '123.456.789-00',
          birthDate: '1990-05-15',
          address: 'Rua das Flores, 123 - São Paulo, SP',
          status: 'active',
          createdAt: new Date('2024-01-15').toISOString(),
          updatedAt: new Date('2024-01-15').toISOString(),
          avatarUrl: 'https://ui-avatars.com/api/?name=AS&background=6366f1&color=fff&size=128',
          isVerified: true,
          phoneType: 'mobile'
        },
        {
          id: 'client-1002',
          userId: 'demo-user',
          name: 'Carlos Mendes',
          email: 'carlos.mendes@email.com',
          phone: '(21) 97654-3210',
          cpf: '234.567.890-11',
          birthDate: '1985-08-22',
          address: 'Av. Paulista, 456 - São Paulo, SP',
          status: 'active',
          createdAt: new Date('2024-02-10').toISOString(),
          updatedAt: new Date('2024-02-10').toISOString(),
          avatarUrl: 'https://ui-avatars.com/api/?name=CM&background=10b981&color=fff&size=128',
          isVerified: true,
          phoneType: 'work'
        },
        {
          id: 'client-1003',
          userId: 'demo-user',
          name: 'Beatriz Costa',
          email: 'beatriz.costa@email.com',
          phone: '(11) 96543-2109',
          cpf: '345.678.901-22',
          birthDate: '1992-03-10',
          address: 'Rua Augusta, 789 - São Paulo, SP',
          status: 'inactive',
          createdAt: new Date('2024-01-20').toISOString(),
          updatedAt: new Date('2024-01-20').toISOString(),
          avatarUrl: 'https://ui-avatars.com/api/?name=BC&background=64748b&color=fff&size=128',
          isVerified: false,
          phoneType: 'mobile'
        },
        {
          id: 'client-1004',
          userId: 'demo-user',
          name: 'Daniel Oliveira',
          email: 'daniel.oliveira@email.com',
          phone: '(11) 95432-1098',
          cpf: '456.789.012-33',
          birthDate: '1988-11-30',
          address: 'Rua Oscar Freire, 321 - São Paulo, SP',
          status: 'active',
          createdAt: new Date('2024-02-14').toISOString(),
          updatedAt: new Date('2024-02-14').toISOString(),
          avatarUrl: 'https://ui-avatars.com/api/?name=DO&background=8b5cf6&color=fff&size=128',
          isVerified: true,
          phoneType: 'mobile'
        },
        {
          id: 'client-1005',
          userId: 'demo-user',
          name: 'Fernanda Santos',
          email: 'fernanda.santos@email.com',
          phone: '(21) 94321-0987',
          cpf: '567.890.123-44',
          birthDate: '1995-07-18',
          address: 'Av. Brigadeiro, 654 - São Paulo, SP',
          status: 'pending',
          createdAt: new Date('2024-02-13').toISOString(),
          updatedAt: new Date('2024-02-13').toISOString(),
          avatarUrl: 'https://ui-avatars.com/api/?name=FS&background=f59e0b&color=fff&size=128',
          isVerified: false,
          phoneType: 'work'
        }
      ];

      this.saveClients(demoClients);
    }
  }

  private getStoredClients(): Client[] {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
  }

  private saveClients(clients: Client[]) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(clients));
  }

  getClients(): Observable<Client[]> {
    return of(this.getStoredClients()).pipe(
        delay(500),
        map(clients => {
             // Filter by current user if we want multi-tenancy simulation
             const user = this.authService.currentUserSig();
             if (!user) return [];
             // Return all clients for demo purposes (or filter by userId)
             return clients.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        })
    );
  }

  getClient(id: string): Observable<Client | undefined> {
    return of(this.getStoredClients().find(c => c.id === id)).pipe(delay(300));
  }

  addClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Observable<string> {
    return of(client).pipe(
        delay(500),
        map(() => {
            const user = this.authService.currentUserSig();
            if (!user) throw new Error('User not authenticated');

            const id = 'client-' + Date.now();
            // Generate deterministic avatar based on name initials
            const initials = client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const avatarUrl = `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=128`;
            
            const newClient: Client = {
                ...client,
                id: id,
                userId: user.uid,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                // Mock extra fields if logic permits, or rely on form
                avatarUrl: avatarUrl,
                isVerified: Math.random() > 0.5,
                phoneType: Math.random() > 0.6 ? 'mobile' : 'work',
                status: client.status // Ensure status is passed
            };

            const clients = this.getStoredClients();
            clients.push(newClient);
            this.saveClients(clients);

            return newClient.id!;
        })
    );
  }

  updateClient(id: string, client: Partial<Client>): Observable<void> {
    return of(void 0).pipe(
        delay(500),
        map(() => {
            const clients = this.getStoredClients();
            const index = clients.findIndex(c => c.id === id);
            if (index !== -1) {
                clients[index] = { 
                    ...clients[index], 
                    ...client, 
                    updatedAt: new Date().toISOString() 
                };
                this.saveClients(clients);
            }
        })
    );
  }

  deleteClient(id: string): Observable<void> {
    return of(void 0).pipe(
        delay(500),
        map(() => {
            let clients = this.getStoredClients();
            clients = clients.filter(c => c.id !== id);
            this.saveClients(clients);
        })
    );
  }
}
