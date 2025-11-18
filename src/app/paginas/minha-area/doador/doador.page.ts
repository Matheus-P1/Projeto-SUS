import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonHeader, IonToolbar, IonContent, IonTitle, IonButtons, IonBackButton,
  IonCard, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonLabel,
  AlertController
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-doador',
  templateUrl: './doador.page.html',
  styleUrls: ['./doador.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonContent, IonTitle,
    IonButtons, IonBackButton, IonCard, IonGrid, IonRow, IonCol, IonButton,
    IonIcon, IonLabel
  ]
})
export class DoadorPage {

  usuario = {
    nome: 'João Mariano Silveira Nascimento',
    dataNascimento: '20/06/1970'
  };

  tipoSanguineo: string | null = null;

  constructor(private alertController: AlertController) { }

  ionViewWillEnter() {
    const salvo = localStorage.getItem('meu_tipo_sanguineo');
    if (salvo) {
      this.tipoSanguineo = salvo;
    }
  }

  async adicionarTipoSanguineo() {
    const alert = await this.alertController.create({
      header: 'Adicionar Tipo Sanguíneo',
      message: 'Qual é o seu tipo sanguíneo?',
      inputs: [
        {
          name: 'tipo',
          type: 'text',
          placeholder: 'Ex: A+, O-'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salvar',
          handler: (data) => {
            if (data.tipo) {
              this.salvarLocalmente(data.tipo);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  salvarLocalmente(tipo: string) {
    this.tipoSanguineo = tipo.toUpperCase();
    localStorage.setItem('meu_tipo_sanguineo', this.tipoSanguineo);
  }

}