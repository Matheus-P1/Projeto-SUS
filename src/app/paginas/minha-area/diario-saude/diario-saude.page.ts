import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular/standalone'; 
import { DiarioSaudeService, RegistroPressao, RegistroGlicose, RegistroIMC } from './diario-saude.service';
import { addIcons } from 'ionicons';
import { addCircle, trashOutline } from 'ionicons/icons';

import { PressaoModalComponent } from '../../../componentes/pressao-modal/pressao-modal.component';
import { GlicoseModalComponent } from '../../../componentes/glicose-modal/glicose-modal.component';
import { ImcModalComponent } from '../../../componentes/imc-modal/imc-modal.component';
import { SimpleHeaderModule } from 'src/app/componentes/simple-header/simple-header.module';
import {
  IonContent, 
  IonSegment, 
  IonSegmentButton, 
  IonLabel, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonCard, 
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-diario-saude',
  templateUrl: './diario-saude.page.html',
  styleUrls: ['./diario-saude.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonContent, 
    IonSegment, 
    IonSegmentButton, 
    IonLabel, 
    IonGrid,
    IonRow, 
    IonCol, 
    IonCard, 
    IonIcon,
    SimpleHeaderModule
  ]
})
export class DiarioSaudePage implements OnInit {

  segmentoAtivo: string = 'pressao';
  registrosPressao: RegistroPressao[] = [];
  registrosGlicose: RegistroGlicose[] = [];
  registrosIMC: RegistroIMC[] = [];

  constructor(
    private modalCtrl: ModalController,
    private diarioService: DiarioSaudeService,
    private alertController: AlertController
  ) { 
    addIcons({ addCircle, trashOutline });
  }

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.registrosPressao = this.diarioService.getRegistrosPressao();
    this.registrosGlicose = this.diarioService.getRegistrosGlicose();
    this.registrosIMC = this.diarioService.getRegistrosIMC();
  }

  onSegmentChange(event: any) {
    this.segmentoAtivo = event.detail.value;
  }

  
  async confirmarExclusao(registro: any, tipo: 'pressao' | 'glicose' | 'imc') {
    const alert = await this.alertController.create({
      header: 'Excluir Registro',
      message: 'Tem certeza que deseja remover este registro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => {
            this.deletarRegistro(registro, tipo);
          }
        }
      ]
    });

    await alert.present();
  }

  deletarRegistro(registro: any, tipo: string) {
    if (tipo === 'pressao') {
        this.diarioService.removeRegistroPressao(registro);
    } 
    else if (tipo === 'glicose') {
        this.diarioService.removeRegistroGlicose(registro);
    }
    else if (tipo === 'imc') {
        this.diarioService.removeRegistroIMC(registro);
    }

    this.carregarDados();
  }


  async abrirModalAdicionar() {
    let modalComponent;
    if (this.segmentoAtivo === 'pressao') {
      modalComponent = PressaoModalComponent;
    } 
    else if (this.segmentoAtivo === 'glicose') {
      modalComponent = GlicoseModalComponent;
    } 
    else if (this.segmentoAtivo === 'imc') {
      modalComponent = ImcModalComponent;
    }

    if (!modalComponent) {
      return;
    }

    const modal = await this.modalCtrl.create({
      component: modalComponent,
      breakpoints: [0, 0.6, 0.8],
      initialBreakpoint: 0.6,
      handle: true,
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();

    if (role === 'adicionar') {
      if (this.segmentoAtivo === 'pressao') {
        this.diarioService.addRegistroPressao(data);
      }
      else if (this.segmentoAtivo === 'glicose') {
        this.diarioService.addRegistroGlicose(data);
      }
      else if (this.segmentoAtivo === 'imc') {
        this.diarioService.addRegistroIMC(data);
      }
      this.carregarDados(); 
    }
  }
}