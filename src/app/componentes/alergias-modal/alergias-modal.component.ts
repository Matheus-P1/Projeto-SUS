import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonFooter, 
  IonToolbar, 
  IonButton, 
  IonAccordion, 
  IonAccordionGroup, 
  IonItem, 
  IonIcon, 
  IonLabel, 
  IonList, 
  IonCheckbox,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { nutrition, bug, medkit, flower } from 'ionicons/icons';

import { ALERGIAS_DATA, CategoriaAlergia } from './alergias-data';

@Component({
  selector: 'app-alergias-modal',
  templateUrl: './alergias-modal.component.html',
  styleUrls: ['./alergias-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonContent, 
    IonFooter, 
    IonToolbar, 
    IonButton, 
    IonAccordion, 
    IonAccordionGroup,
    IonItem, 
    IonIcon, 
    IonLabel, 
    IonList, 
    IonCheckbox
  ]
})
export class AlergiasModalComponent implements OnInit {

  @Input() alergiasPreSelecionadas: any[] = [];

  categorias: CategoriaAlergia[] = JSON.parse(JSON.stringify(ALERGIAS_DATA));

  constructor(private modalCtrl: ModalController) {
    addIcons({ nutrition, bug, medkit, flower });
  }

  ngOnInit() {
    if (this.alergiasPreSelecionadas && this.alergiasPreSelecionadas.length > 0) {
      this.marcarItensJaSalvos();
    }
  }

  marcarItensJaSalvos() {
    this.categorias.forEach(cat => {
      cat.itens.forEach(item => {
        const estaSalvo = this.alergiasPreSelecionadas.some(salvo => 
          salvo.nome === item.nome && salvo.categoria === cat.titulo
        );
        if (estaSalvo) {
          item.marcado = true;
        }
      });
    });
  }

  cancelar() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  salvar() {
    const selecionados: { categoria: string, nome: string }[] = [];
    this.categorias.forEach(cat => {
      cat.itens.forEach(item => {
        if (item.marcado) {
          selecionados.push({ categoria: cat.titulo, nome: item.nome });
        }
      });
    });
    return this.modalCtrl.dismiss(selecionados, 'confirm');
  }
}