import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BarraDeAbasComponent } from 'src/app/componentes/barra-de-abas/barra-de-abas.component';
import { CabecalhoComponent } from 'src/app/componentes/cabecalho/cabecalho.component';
import { NavController } from '@ionic/angular';

import {
  IonHeader,
  IonIcon,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonCard,
  IonFooter,
  IonRippleEffect,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-servicos',
  templateUrl: './servicos.page.html',
  styleUrls: ['./servicos.page.scss'],
  standalone: true,
  imports: [
    IonFooter,
    BarraDeAbasComponent,
    CabecalhoComponent,
    IonCard,
    CommonModule,
    FormsModule,
    IonHeader,
    IonIcon,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonLabel,
    IonRippleEffect,
  ],
})
export class ServicosPage {
  services = [
    {
      id: 'teleconsulta',
      name: 'Agendar Teleconsulta',
      icon: 'phone-portrait-outline',
      disabled: true,
    },
    { id: 'consulta', name: 'Agendar Consulta', icon: 'calendar-outline' },
    { id: 'exame', name: 'Agendar Exame', icon: 'pulse-outline' },
    {
      id: 'resultados',
      name: 'Resultados de Exames',
      icon: 'document-text-outline',
      disabled: false,
    },
    {
      id: 'agendamentos',
      name: 'Meus Agendamentos',
      icon: 'calendar-number-outline',
    },
    {
      id: 'vacinacao',
      name: 'Vacinação',
      icon: 'eyedrop-outline',
      disabled: true,
    },
    {
      id: 'atendimentos',
      name: 'Atendimentos e Internações',
      icon: 'business-outline',
    },
    { id: 'rede', name: 'Rede de Saúde', icon: 'map-outline', disabled: true },
  ];

  constructor(private navCtrl: NavController) {}

  onServiceClick(serviceId: string) {
    if (serviceId === 'consulta') {
      this.navCtrl.navigateForward('/agendar-consulta');
    } else if (serviceId === 'exame') {
      this.navCtrl.navigateForward('/agendar-exames');
    } else if (serviceId === 'agendamentos') {
      this.navCtrl.navigateForward('/meus-agendamentos');
    } else if (serviceId === 'resultados') {
      this.navCtrl.navigateForward('/resultados-exames');
    } else if (serviceId === 'atendimentos') {
      this.navCtrl.navigateForward('/atendimentos-internacoes');
    } else {
      console.warn('Nenhuma rota definida para:', serviceId);
    }
  }

}
