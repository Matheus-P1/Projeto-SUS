import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SimpleHeaderComponent } from './simple-header.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [SimpleHeaderComponent],
  exports: [SimpleHeaderComponent],
})
export class SimpleHeaderModule {}
