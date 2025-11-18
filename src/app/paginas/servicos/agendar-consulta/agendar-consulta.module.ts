import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DoctorCardComponent } from 'src/app/componentes/doctor-card/doctor-card.component';
import { AgendarConsultaPageRoutingModule } from './agendar-consulta-routing.module';

import { AgendarConsultaPage } from './agendar-consulta.page';
import { HttpClientModule } from '@angular/common/http';
import { SimpleHeaderModule } from 'src/app/componentes/simple-header/simple-header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule,
    AgendarConsultaPageRoutingModule,
    DoctorCardComponent,
    SimpleHeaderModule,
  ],
  declarations: [AgendarConsultaPage],
})
export class AgendarConsultaPageModule {}
