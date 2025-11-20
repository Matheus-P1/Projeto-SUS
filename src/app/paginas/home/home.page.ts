import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

import { ListaAgendamentosComponent } from 'src/app/componentes/lista-agendamentos/lista-agendamentos.component';

interface AgendamentoApi {
  _id: string;
  dateTime: string;
  type: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | string;
  user: string;
  doctor: {
    _id: string;
    name: string;
    specialty: string;
  };
  healthUnit: {
    _id: string;
    name: string;
    address: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  @ViewChild(ListaAgendamentosComponent)
  listaAgendamentos!: ListaAgendamentosComponent;

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

  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  handleRefresh(event: any) {
    if (this.listaAgendamentos) {
      this.listaAgendamentos.carregarAgendamentos(event);
    } else {
      setTimeout(() => event.target.complete(), 500);
    }
  }

  onServiceClick(serviceId: string) {
    if (serviceId === 'consulta') {
      this.navCtrl.navigateForward('/agendar-consulta');
    } else if (serviceId === 'exame') {
      this.navCtrl.navigateForward('/agendar-exames');
    } else {
      console.warn('Nenhuma rota definida para:', serviceId);
    }
  }


  verTodosServicos() {
    this.navCtrl.navigateForward(['/servicos']);
  }
}
