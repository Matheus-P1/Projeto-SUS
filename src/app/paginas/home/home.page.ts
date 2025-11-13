import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CabecalhoComponent } from '../../componentes/cabecalho/cabecalho.component';
import { BarraDeAbasComponent } from '../../componentes/barra-de-abas/barra-de-abas.component';

import {
  IonHeader,
  IonContent,
  IonFooter,
  IonImg,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonIcon,
  IonLabel,
  IonButton,
  IonText,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,

  imports: [
    //IonToolbar,
    CommonModule,
    FormsModule,
    IonHeader,
    IonContent,
    IonFooter,
    IonImg,
    IonSearchbar,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonIcon,
    IonLabel,
    //IonButton,
    IonText,
    CabecalhoComponent,
    BarraDeAbasComponent,
  ],
})
export class HomePage {
  private allServices = [
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
    },
    {
      id: 'agendamentos',
      name: 'Agendamentos e Internações',
      icon: 'calendar-number-outline',
    },
    { id: 'vacinacao', name: 'Vacinação', icon: 'eyedrop-outline' },
    {
      id: 'atendimentos',
      name: 'Atendimentos e Internações',
      icon: 'business-outline',
    },
    { id: 'rede', name: 'Rede de Saúde', icon: 'location-outline' },
  ];

  servicosReduzidos = this.allServices.slice(0, 3);

  constructor(private router: Router) {}

  onServiceClick(serviceId: string) {
    console.log('Clicou no serviço (Home):', serviceId);
    let navigationPromise: Promise<boolean> | null = null;
    if (serviceId === 'consulta') {
      navigationPromise = this.router.navigate(['/agendar-consulta']);
    } else if (serviceId === 'exame') {
      navigationPromise = this.router.navigate(['/agendar-exames']);
    }
    // Adicione o 'teleconsulta' se for implementar a tela dele
    // else if (serviceId === 'teleconsulta') {
    //   navigationPromise = this.router.navigate(['/agendar-teleconsulta']);
    // }
    else {
      console.warn('Nenhuma rota definida para o serviceId:', serviceId);
      return;
    }
    if (navigationPromise) {
      navigationPromise.catch((error) => {
        console.error('ERRO AO TENTAR NAVEGAR para ' + serviceId + ':', error);
      });
    }
  }

  // Função para o botão "Ver mais"
  verTodosServicos() {
    // Navega para a página principal de Serviços
    this.router.navigate(['/servicos']);
  }
}
