import { Component, OnInit, Inject, forwardRef, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';

import { 
  IonContent, 
  IonImg, 
  IonButton, 
  IonIcon,
} from '@ionic/angular/standalone';

import { MedicamentosService, Medicamento } from './medicamentos.service';
import { MedicamentosModalComponent } from '../../../componentes/medicamentos-modal/medicamentos-modal.component';
import { SimpleHeaderModule } from 'src/app/componentes/simple-header/simple-header.module';

@Component({
  selector: 'app-medicamentos',
  templateUrl: './medicamentos.page.html',
  styleUrls: ['./medicamentos.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    //MedicamentosModalComponent,
    CommonModule, 
    IonContent, 
    IonImg, 
    IonButton, 
    IonIcon, 
    SimpleHeaderModule
  ]
})
export class MedicamentosPage implements OnInit {

  listaMedicamentos: Medicamento[] = [];

  constructor(
    private modalCtrl: ModalController,
    @Inject(forwardRef(() => MedicamentosService)) private medicamentosService: MedicamentosService
  ) { }

  ngOnInit() {
    this.carregarDados();
  }
  
  ionViewWillEnter() {
    this.carregarDados();
  }

  carregarDados() {
    this.listaMedicamentos = this.medicamentosService.getMedicamentos();
  }

  async abrirModalmedicamentos() {
    const modal = await this.modalCtrl.create({
      component: MedicamentosModalComponent,
      breakpoints: [0, 0.75, 1.0],
      initialBreakpoint: 0.75,
      handle: true
    });
    await modal.present();

    const { data, role } = await modal.onDidDismiss();

    if (role === 'adicionar' && data) {
      data.forEach((nome: string) => {
        this.medicamentosService.adicionarMedicamento(nome);
      });
      this.carregarDados();
    }
  }

  remover(nome: string) {
    this.medicamentosService.removerMedicamento(nome);
    this.carregarDados();
  }
}