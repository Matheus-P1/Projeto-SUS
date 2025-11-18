import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface ExamSchedule {
  _id: string;
  examId: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | string;
  dateTime: string;
  healthUnit: { _id: string; name: string; address: string };
}

@Component({
  selector: 'app-exam-card',
  templateUrl: './exam-card.component.html',
  styleUrls: ['./exam-card.component.scss'],
  standalone: false,
})
export class ExamCardComponent {
  @Input() exam: ExamSchedule | null = null;
  @Output() cancelClicked = new EventEmitter<string>();
  @Output() removeClicked = new EventEmitter<string>();

  constructor() {}

  get formattedName(): string {
    if (!this.exam?.examId) return 'Exame';

    const traducoes: { [key: string]: string } = {
      blood_test: 'Exame de Sangue',
      x_ray_chest: 'Raio-X do Tórax',
      urine_test: 'Exame de Urina',
      covid_test: 'Teste de COVID-19',
      ultrasound: 'Ultrassonografia',
    };

    return traducoes[this.exam.examId] || this.exam.examId.replace(/_/g, ' ');
  }

  get formattedDate(): string {
    if (!this.exam) return '';
    try {
      return new Date(this.exam.dateTime).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return '--/--/----';
    }
  }

  get formattedTime(): string {
    if (!this.exam) return '';
    try {
      return new Date(this.exam.dateTime)
        .toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        .replace(':', 'h');
    } catch {
      return '--h--';
    }
  }

  get statusClass(): string {
    return this.exam?.status ? this.exam.status.toLowerCase() : '';
  }

  get formattedStatus(): string {
    switch (this.exam?.status) {
      case 'Pending':
        return 'Pendente';
      case 'Confirmed':
        return 'Confirmado';
      case 'Cancelled':
        return 'Cancelado';
      default:
        return this.exam?.status || '';
    }
  }

  onCancelClick(event: MouseEvent) {
    event.stopPropagation();
    this.cancelClicked.emit(this.exam?._id);
  }

  onRemoveClick(event: MouseEvent) {
    event.stopPropagation();
    this.removeClicked.emit(this.exam?._id);
  }
}
