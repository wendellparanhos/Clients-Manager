import { Injectable, signal } from '@angular/core';

export interface Toast {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);
  private counter = 0;

  show(type: Toast['type'], title: string, message: string, duration = 4000) {
    const id = this.counter++;
    const newToast: Toast = { type, title, message, id };
    
    this.toasts.update(val => [...val, newToast]);

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  success(title: string, message: string) {
    this.show('success', title, message);
  }

  error(title: string, message: string) {
    this.show('error', title, message);
  }

  info(title: string, message: string) {
    this.show('info', title, message);
  }

  warning(title: string, message: string) {
    this.show('warning', title, message);
  }

  remove(id: number) {
    this.toasts.update(val => val.filter(t => t.id !== id));
  }
}
