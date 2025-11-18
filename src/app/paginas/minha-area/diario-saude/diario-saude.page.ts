import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular/standalone';
import { DiarioSaudeService, RegistroPressao, RegistroGlicose, RegistroIMC } from './diario-saude.service';

import { PressaoModalComponent } from '../../../componentes/pressao-modal/pressao-modal.component';
import { GlicoseModalComponent } from '../../../componentes/glicose-modal/glicose-modal.component';
import { ImcModalComponent } from '../../../componentes/imc-modal/imc-modal.component';

import {
  IonHeader, 
  IonToolbar, 
  IonContent, 
  IonTitle,
  IonButtons, 
  IonBackButton,
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
    IonHeader, 
    IonToolbar, 
    IonContent, 
    IonTitle,
    IonButtons, 
    IonBackButton, 
    IonSegment, 
    IonSegmentButton, 
    IonLabel, 
    IonGrid,
    IonRow, 
    IonCol, 
    IonCard, 
    IonIcon,
    PressaoModalComponent, 
    GlicoseModalComponent,
    ImcModalComponent
  ]
})
export class DiarioSaudePage implements OnInit {

  segmentoAtivo: string = 'pressao'; 
  
  registrosPressao: RegistroPressao[] = [];
  registrosGlicose: RegistroGlicose[] = [];
  registrosIMC: RegistroIMC[] = [];

  constructor(
    private modalCtrl: ModalController,
    private diarioService: DiarioSaudeService
  ) { }

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

  async abrirModalAdicionar() {
    let modalComponent;
    
    if (this.segmentoAtivo === 'pressao') {
      modalComponent = PressaoModalComponent;
    } 
    else if (this.segmentoAtivo === 'glicose') {
      console.log('Abrir modal para Glicose...');
      modalComponent = GlicoseModalComponent;
    } 
    else if (this.segmentoAtivo === 'imc') {
      console.log('Abrir modal para IMC...');
      modalComponent = ImcModalComponent;
    }

    if (!modalComponent) {
      console.warn('Modal para este segmento ainda não implementado:', this.segmentoAtivo);
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