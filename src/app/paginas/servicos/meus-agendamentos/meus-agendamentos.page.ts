import { Component, ViewChild } from '@angular/core';

import { ListaAgendamentosComponent } from 'src/app/componentes/lista-agendamentos/lista-agendamentos.component';
import { ListaExamesComponent } from 'src/app/componentes/lista-exames/lista-exames.component';

@Component({
  selector: 'app-meus-agendamentos',
  templateUrl: './meus-agendamentos.page.html',
  styleUrls: ['./meus-agendamentos.page.scss'],
  standalone: false,
})
export class MeusAgendamentosPage {
  @ViewChild(ListaAgendamentosComponent)
  listaAgendamentos!: ListaAgendamentosComponent;
  @ViewChild(ListaExamesComponent)
  listaExames!: ListaExamesComponent;

  constructor() {}

  handleRefresh(event: any) {
    if (this.listaAgendamentos) {
      this.listaAgendamentos.carregarAgendamentos(event);
    } else if (this.listaExames) {
      this.listaExames.carregarExames(event);
    } else {
      setTimeout(() => event.target.complete(), 500);
    }
  }
}
