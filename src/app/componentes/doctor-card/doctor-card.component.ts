import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SelectedTime } from 'src/app/paginas/servicos/agendar-consulta/agendar-consulta.page';

@Component({
  selector: 'app-doctor-card',
  templateUrl: './doctor-card.component.html',
  styleUrls: ['./doctor-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class DoctorCardComponent {
  @Input() name: string = '';
  @Input() specialty: string = '';
  @Input() crm: string = '';
  @Input() availability: SelectedTime[] = [];
  @Input() healthUnit: {
    _id: string;
    name: string;
    address: string;
  } | null = null;

  @Input() selectedSlot: SelectedTime | null = null;

  @Output() slotSelected = new EventEmitter<{
    time: string;
    id: string;
    item: string;
  }>();

  constructor() {}

  selectSlot(slot: SelectedTime) {
    this.slotSelected.emit(slot);
  }
}
