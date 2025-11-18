import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonImg,
  ModalController,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  add,
  nutrition,
  medkit,
  alertCircle,
  bug,
  flower,
} from 'ionicons/icons';
import { AlergiasModalComponent } from '../../../componentes/alergias-modal/alergias-modal.component';
import { AlergiaService } from './alergia.service';
import { SimpleHeaderModule } from 'src/app/componentes/simple-header/simple-header.module';

@Component({
  selector: 'app-alergias',
  templateUrl: './alergias.page.html',
  styleUrls: ['./alergias.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonContent,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonImg,
    SimpleHeaderModule,
  ],
})
export class AlergiasPage {
  alergiasCadastradas: any[] = [];

  constructor(
    private modalCtrl: ModalController,
    private alergiaService: AlergiaService
  ) {
    addIcons({ add, nutrition, medkit, alertCircle, bug, flower });
  }

  ionViewWillEnter() {
    this.alergiasCadastradas = this.alergiaService.carregarAlergias();
  }

  async abrirModalAlergias() {
    const modal = await this.modalCtrl.create({
      component: AlergiasModalComponent,
      breakpoints: [0, 0.5, 0.85, 1.0],
      initialBreakpoint: 0.5,
      handle: true,
      componentProps: {
        alergiasPreSelecionadas: this.alergiasCadastradas,
      },
    });

    modal.onDidDismiss().then((retorno) => {
      if (retorno.role === 'confirm' && retorno.data) {
        this.alergiasCadastradas = retorno.data;
        this.alergiaService.salvarAlergias(this.alergiasCadastradas);
      }
    });

    await modal.present();
  }

  getIconeCategoria(categoria: string): string {
    const catLower = categoria.toLowerCase();
    if (catLower.includes('alimentar')) return 'nutrition';
    if (catLower.includes('medicamentos')) return 'medkit';
    if (catLower.includes('animais') || catLower.includes('insetos'))
      return 'bug';
    if (catLower.includes('ambientais')) return 'flower';
    return 'alert-circle';
  }
}
