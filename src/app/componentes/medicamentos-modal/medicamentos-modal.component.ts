import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-medicamentos-modal',
  templateUrl: './medicamentos-modal.component.html',
  styleUrls: ['./medicamentos-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class MedicamentosModalComponent {

  sugestoes = [
    { nome: 'Dipirona', selecionado: false },
    { nome: 'Amoxicilina', selecionado: false },
    { nome: 'Losartana', selecionado: false },
    { nome: 'Ibuprofeno', selecionado: false },
    { nome: 'Cloridrato de metformina', selecionado: false },
    { nome: 'Atenolol', selecionado: false },
    { nome: 'Tramadol', selecionado: false },
    { nome: 'Escitalopram', selecionado: false }
  ];

  constructor(private modalCtrl: ModalController) { }

  cancelar() {
    this.modalCtrl.dismiss(null, 'cancelar');
  }

  salvar() {
    const selecionados = this.sugestoes
      .filter(item => item.selecionado)
      .map(item => item.nome);
    
    this.modalCtrl.dismiss(selecionados, 'adicionar');
  }
}