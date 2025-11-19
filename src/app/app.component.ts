import { Component, HostListener } from '@angular/core';
import { addIcons } from 'ionicons';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar } from '@capacitor/status-bar';
import { NavigationBar } from '@hugotomazi/capacitor-navigation-bar';
import { Platform } from '@ionic/angular';

import {
  logOut,
  phonePortraitOutline,
  calendarOutline,
  pulseOutline,
  documentTextOutline,
  eyedropOutline,
  addCircleOutline,
  mapOutline,
  home,
  apps,
  medkit,
  person,
  locationOutline,
  calendarNumberOutline,
  statsChartOutline,
  businessOutline,
  grid,
  megaphone,
  medkitOutline,
  cardOutline,
  documentAttachOutline,
  bugOutline,
  bookOutline,
  arrowBack,
  closeCircleOutline,
  trashOutline,
  eyeOffOutline,
  eyeOutline,
  cloudUploadOutline,
  addCircle,
  add,
  arrowBackOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private platform: Platform) {
    document.body.setAttribute('color-theme', 'light');

    addIcons({
      logOut,
      phonePortraitOutline,
      calendarOutline,
      pulseOutline,
      documentTextOutline,
      eyedropOutline,
      addCircleOutline,
      mapOutline,
      home,
      apps,
      medkit,
      person,
      locationOutline,
      calendarNumberOutline,
      statsChartOutline,
      businessOutline,
      grid,
      megaphone,
      medkitOutline,
      cardOutline,
      documentAttachOutline,
      bugOutline,
      bookOutline,
      arrowBack,
      closeCircleOutline,
      trashOutline,
      eyeOffOutline,
      eyeOutline,
      cloudUploadOutline,
      addCircle,
      add,
      arrowBackOutline,
    });

    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();

    if (this.platform.is('hybrid')) {
      this.esconderBarras();
    }
  }

  async esconderBarras() {
      try {
        await StatusBar.hide();
        await NavigationBar.hide();
      } catch (err) {
        console.log('erro ao esconder atributos (normal no pc):', err);
      }
  }
  
  @HostListener('window:click')
  @HostListener('window:touchstart')
  async onUserInteraction() {
    if (this.platform.is('hybrid')) {
      await this.esconderBarras();
    }
  }

}
