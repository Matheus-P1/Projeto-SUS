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
  IonTitle
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone'; 

@Component({
  selector: 'app-imc-modal',
  templateUrl: './imc-modal.component.html',
  styleUrls: ['./imc-modal.component.scss'],
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
    IonTitle
  ]
})
export class ImcModalComponent {

  peso: string = '';
  altura: string = '';
  data: string = '';

  constructor(private modalCtrl: ModalController) { }

  cancelar() {
    this.modalCtrl.dismiss(null, 'cancelar');
  }

  adicionar() {
    let imcCalculado = 'N/A';
    try {
      const p = parseFloat(this.peso);
      const a = parseFloat(this.altura);
      if (p > 0 && a > 0) {
        const imcValue = p / (a * a);
        imcCalculado = imcValue.toFixed(1); 
      }
    } catch (e) {
      console.error('Erro ao calcular IMC', e);
    }
    const novoRegistro = {
      valor: imcCalculado,
      data: this.data
    };
    
    this.modalCtrl.dismiss(novoRegistro, 'adicionar');
  }
  
}