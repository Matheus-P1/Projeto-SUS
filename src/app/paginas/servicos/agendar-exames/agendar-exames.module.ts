import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AgendarExamesPage } from './agendar-exames.page';

import { SimpleHeaderModule } from 'src/app/componentes/simple-header/simple-header.module';
import { ApiSelectModule } from 'src/app/componentes/api-select/api-select.module';
import { AgendarExamesPageRoutingModule } from './agendar-exames-routing.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AgendarExamesPageRoutingModule,
    SimpleHeaderModule,
    ApiSelectModule,
    HttpClientModule,
  ],
  declarations: [AgendarExamesPage],
})
export class AgendarExamesPageModule {}
