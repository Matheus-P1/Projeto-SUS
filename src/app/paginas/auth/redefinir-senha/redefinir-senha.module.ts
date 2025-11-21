import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RedefinirSenhaPage } from './redefinir-senha.page';
import { CustomInputComponent } from 'src/app/componentes/custom-input/custom-input.component';
import { RedefinirSenhaPageRoutingModule } from './redefinir-senha-routing.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RedefinirSenhaPageRoutingModule,
    ReactiveFormsModule,
    CustomInputComponent,
    HttpClientModule,
  ],
  declarations: [RedefinirSenhaPage],
})
export class RedefinirSenhaPageModule {}
