import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { ExamCardModule } from '../exam-card/exam-card.module';
import { ListaExamesComponent } from './lista-exames.component';

@NgModule({
  imports: [CommonModule, IonicModule, HttpClientModule, ExamCardModule],
  declarations: [ListaExamesComponent],
  exports: [ListaExamesComponent],
})
export class ListaExamesModule {}
