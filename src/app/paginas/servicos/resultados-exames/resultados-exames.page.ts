import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonTitle,
  IonButtons,
  IonBackButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-resultados-exames',
  templateUrl: './resultados-exames.page.html',
  styleUrls: ['./resultados-exames.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonContent,
    //IonTitle,
    IonButtons,
    IonBackButton
  ]
})
export class ResultadosExamesPage {

  constructor() { }

}