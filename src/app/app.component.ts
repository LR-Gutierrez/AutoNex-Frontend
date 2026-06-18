import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  barcodeOutline,
  callOutline,
  carOutline,
  checkmarkCircleOutline,
  checkmarkOutline,
  clipboardOutline,
  closeCircleOutline,
  createOutline,
  cubeOutline,
  flagOutline,
  informationCircleOutline,
  layersOutline,
  mailOutline,
  personOutline,
  playOutline,
  pricetagOutline,
  refreshOutline,
  resizeOutline,
  timeOutline,
  trashOutline,
  trendingDownOutline,
  trendingUpOutline,
  warningOutline,
  eyeOffOutline,
  eyeOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor() {
    addIcons({
      alertCircleOutline,
      barcodeOutline,
      callOutline,
      carOutline,
      checkmarkCircleOutline,
      checkmarkOutline,
      clipboardOutline,
      closeCircleOutline,
      createOutline,
      cubeOutline,
      flagOutline,
      informationCircleOutline,
      layersOutline,
      mailOutline,
      personOutline,
      playOutline,
      pricetagOutline,
      refreshOutline,
      resizeOutline,
      timeOutline,
      trashOutline,
      trendingDownOutline,
      trendingUpOutline,
      warningOutline,
      eyeOffOutline,
      eyeOutline,
    });
  }
}
