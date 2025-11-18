import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { MeusAgendamentosPageRoutingModule } from './meus-agendamentos-routing.module';
import { MeusAgendamentosPage } from './meus-agendamentos.page';

import { ListaAgendamentosComponent } from 'src/app/componentes/lista-agendamentos/lista-agendamentos.component';
import { SimpleHeaderModule } from 'src/app/componentes/simple-header/simple-header.module';
import { ListaExamesModule } from 'src/app/componentes/lista-exames/lista-exames.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    MeusAgendamentosPageRoutingModule,
    ListaAgendamentosComponent,
    ListaExamesModule,
    SimpleHeaderModule,
  ],
  declarations: [MeusAgendamentosPage],
})
export class MeusAgendamentosPageModule {}
