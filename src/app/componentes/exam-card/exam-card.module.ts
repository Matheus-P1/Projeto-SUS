import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ExamCardComponent } from './exam-card.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [ExamCardComponent],
  exports: [ExamCardComponent],
})
export class ExamCardModule {}
