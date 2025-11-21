import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ValidarTokenPage } from 'src/app/paginas/auth/validar-token/validar-token.page';
import { ValidarTokenPageRoutingModule } from './validar-token-routing.module';
import { NgOtpInputModule } from 'ng-otp-input';
import { CustomInputComponent } from '../../../componentes/custom-input/custom-input.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ValidarTokenPageRoutingModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    CustomInputComponent,
    HttpClientModule,
  ],
  declarations: [ValidarTokenPage],
})
export class ValidarTokenPageModule {}
