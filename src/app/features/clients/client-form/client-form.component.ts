import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models/client.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export class ClientFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  clientForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    cpf: ['', Validators.required],
    address: ['', Validators.required],
    birthDate: ['', Validators.required],
    status: ['active', Validators.required]
  });

  isEditMode = false;
  clientId: string | null = null;
  isLoading = false;

  ngOnInit() {
    this.clientId = this.route.snapshot.paramMap.get('id');
    if (this.clientId) {
      this.isEditMode = true;
      this.loadClient(this.clientId);
    }
  }

  loadClient(id: string) {
    this.isLoading = true;
    this.clientService.getClient(id).subscribe(client => {
      this.isLoading = false;
      if (client) {
        this.clientForm.patchValue(client);
      } else {
        this.router.navigate(['/clients']);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  applyMask(event: any, type: 'cpf' | 'phone') {
    let value = event.target.value.replace(/\D/g, '');
    
    if (type === 'cpf') {
      if (value.length > 11) value = value.slice(0, 11);
      // 000.000.000-00
      if (value.length > 9) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      } else if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
      } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{3})/, '$1.$2');
      }
    } else if (type === 'phone') {
        // (11) 90000-0000
        if (value.length > 11) value = value.slice(0, 11);
        
        if (value.length > 10) {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (value.length > 6) {
             value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (value.length > 2) {
             value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        }
    }

    this.clientForm.get(type)?.setValue(value, { emitEvent: false });
  }

  onSubmit() {
    if (this.clientForm.valid) {
      this.isLoading = true;
      const clientData = this.clientForm.value;

      if (this.isEditMode && this.clientId) {
        this.clientService.updateClient(this.clientId, clientData).subscribe({
          next: () => {
            this.toastService.success('Alterações Salvas', `Os dados de ${clientData.name} foram atualizados.`);
            this.router.navigate(['/clients']);
          },
          error: (err) => {
            this.isLoading = false;
            this.toastService.error('Erro ao Atualizar', 'Não foi possível salvar as alterações.');
          }
        });
      } else {
        this.clientService.addClient(clientData).subscribe({
            next: () => {
                this.toastService.success('Cliente Cadastrado', `${clientData.name} foi adicionado à lista.`);
                this.router.navigate(['/clients']);
            },
            error: (err) => {
                this.isLoading = false;
                this.toastService.error('Erro ao Cadastrar', 'Não foi possível adicionar o cliente.');
            }
        });
      }
    } else {
      this.clientForm.markAllAsTouched();
    }
  }
}
