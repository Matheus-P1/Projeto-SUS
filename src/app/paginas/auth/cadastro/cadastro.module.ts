import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { CadastroPageRoutingModule } from './cadastro-routing.module';

import { CadastroPage } from './cadastro.page';
import { CustomInputComponent } from 'src/app/componentes/custom-input/custom-input.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastroPageRoutingModule,
    ReactiveFormsModule,
    CustomInputComponent,
    HttpClientModule,
  ],
  declarations: [CadastroPage],
})
export class CadastroPageModule {}
