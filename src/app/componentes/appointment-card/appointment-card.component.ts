import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

export interface Appointment {
  _id: string;
  dateTime: string;
  type: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | string;
  doctor: {
    name: string;
    specialty: string;
  };
  healthUnit: {
    name: string;
    address: string;
  };
}

@Component({
  selector: 'app-appointment-card',
  templateUrl: './appointment-card.component.html',
  styleUrls: ['./appointment-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class AppointmentCardComponent {
  @Input() appointment: Appointment | null = null;
  @Output() cancelClicked = new EventEmitter<string>();
  @Output() removeClicked = new EventEmitter<string>();

  constructor() {}

  get formattedDate(): string {
    if (!this.appointment) return '';
    try {
      const date = new Date(this.appointment.dateTime);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (e) {
      return 'Data inválida';
    }
  }

  get formattedTime(): string {
    if (!this.appointment) return '';
    try {
      const date = new Date(this.appointment.dateTime);

      const time = date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return time.replace(':', 'h');
    } catch (e) {
      return '--h--';
    }
  }

  get statusColor(): string {
    switch (this.appointment?.status) {
      case 'Pending':
        return 'warning';
      case 'Confirmed':
        return 'success';
      case 'Cancelled':
        return 'danger';
      default:
        return 'medium';
    }
  }

  get formattedStatus(): string {
    if (!this.appointment) return '';

    switch (this.appointment.status) {
      case 'Pending':
        return 'Pendente';
      case 'Confirmed':
        return 'Confirmado';
      case 'Cancelled':
        return 'Cancelado';
      default:
        return this.appointment.status;
    }
  }

  onCancelClick(event: MouseEvent) {
    event.stopPropagation();
    this.cancelClicked.emit(this.appointment?._id);
  }

  onRemoveClick(event: MouseEvent) {
    event.stopPropagation();
    this.removeClicked.emit(this.appointment?._id);
  }
}
