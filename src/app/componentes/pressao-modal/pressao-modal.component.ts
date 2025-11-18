import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent, 
  IonFooter, 
  IonToolbar, 
  IonButton, 
  //IonIcon,
  IonLabel, 
  //IonItem, 
  IonInput, 
  //IonTitle
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-pressao-modal',
  templateUrl: './pressao-modal.component.html',
  styleUrls: ['./pressao-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonContent, 
    IonFooter, 
    IonToolbar,
    IonButton, 
    //IonIcon, 
    IonLabel, 
    //IonItem, 
    IonInput, 
    //IonTitle
  ]
})
export class PressaoModalComponent {

  pressaoMaxima: string = '';
  pressaoMinima: string = '';
  data: string = '';

  constructor(private modalCtrl: ModalController) { }

  cancelar() {
    this.modalCtrl.dismiss(null, 'cancelar');
  }

  adicionar() {
    const novoRegistro = {
      maxima: this.pressaoMaxima,
      minima: this.pressaoMinima,
      data: this.data
    };
    
    this.modalCtrl.dismiss(novoRegistro, 'adicionar');
  }
}