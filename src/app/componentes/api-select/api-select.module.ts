// Salve em: src/app/componentes/api-select/api-select.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ApiSelectComponent } from './api-select.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [ApiSelectComponent],
  exports: [ApiSelectComponent],
})
export class ApiSelectModule {}
