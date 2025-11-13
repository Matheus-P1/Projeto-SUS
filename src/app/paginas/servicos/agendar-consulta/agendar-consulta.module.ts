import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DoctorCardComponent } from 'src/app/componentes/doctor-card/doctor-card.component';
import { AgendarConsultaPageRoutingModule } from './agendar-consulta-routing.module';

import { AgendarConsultaPage } from './agendar-consulta.page';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule,
    AgendarConsultaPageRoutingModule,
    DoctorCardComponent,
  ],
  declarations: [AgendarConsultaPage],
})
export class AgendarConsultaPageModule {}
