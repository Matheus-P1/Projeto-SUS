import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EsqueciMinhaSenhaPageRoutingModule } from './esqueci-minha-senha-routing.module';

import { EsqueciMinhaSenhaPage } from './esqueci-minha-senha.page';
import { CustomInputComponent } from 'src/app/componentes/custom-input/custom-input.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EsqueciMinhaSenhaPageRoutingModule,
    CustomInputComponent,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  declarations: [EsqueciMinhaSenhaPage],
})
export class EsqueciMinhaSenhaPageModule {}
