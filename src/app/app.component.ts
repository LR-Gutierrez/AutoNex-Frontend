import { Component, OnInit, inject, effect } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { IonApp, IonRouterOutlet, IonIcon } from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  barcodeOutline,
  callOutline,
  calendarOutline,
  carOutline,
  checkmarkCircleOutline,
  checkmarkOutline,
  clipboardOutline,
  closeOutline,
  closeCircleOutline,
  createOutline,
  cubeOutline,
  documentTextOutline,
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
  wifiOutline,
} from 'ionicons/icons';
import { ConnectionMonitorService } from './core/services/connection-monitor.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, IonIcon],
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>

    @if (!connection.isOnline()) {
      <div @fadeOverlay class="connection-overlay">
        <div class="pulse-ring"></div>
        <div class="pulse-ring delay-1"></div>
        <div class="pulse-ring delay-2"></div>

        <div class="overlay-content">
          <div class="overlay-icon">
            <ion-icon name="wifi-outline"></ion-icon>
            <div class="icon-sweep"></div>
          </div>
          <p class="overlay-title">Sin conexión</p>
          <p class="overlay-subtitle">Intentando reconectar&hellip;</p>
          <div class="signal-bar">
            <div class="signal-track"></div>
            <div class="signal-dot"></div>
          </div>
        </div>
      </div>
    }
  `,
  animations: [
    trigger('fadeOverlay', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('250ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
  styles: [
    `
    .connection-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(ellipse at 50% 40%, rgba(30, 30, 60, 0.95), rgba(8, 8, 16, 0.98));
      animation: fadeIn 0.4s ease;
      overflow: hidden;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .pulse-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 200px;
      height: 200px;
      margin: -100px 0 0 -100px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.06);
      animation: pulseExpand 3s ease-out infinite;
      pointer-events: none;
    }

    .pulse-ring.delay-1 { animation-delay: 1s; }
    .pulse-ring.delay-2 { animation-delay: 2s; }

    @keyframes pulseExpand {
      0% { transform: scale(0.6); opacity: 1; }
      100% { transform: scale(2.5); opacity: 0; }
    }

    .overlay-content {
      position: relative;
      text-align: center;
      color: #fff;
    }

    .overlay-icon {
      position: relative;
      width: 80px;
      height: 80px;
      margin: 0 auto 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.04);
      border: 1.5px solid rgba(255, 255, 255, 0.08);
      border-radius: 50%;
      font-size: 34px;
      color: rgba(255, 255, 255, 0.5);
      overflow: hidden;
    }

    .icon-sweep {
      position: absolute;
      inset: -20%;
      background: linear-gradient(
        135deg,
        transparent 40%,
        rgba(255, 255, 255, 0.04) 50%,
        transparent 60%
      );
      animation: sweep 3s ease-in-out infinite;
    }

    @keyframes sweep {
      0% { transform: translateX(-100%) translateY(100%) rotate(45deg); }
      100% { transform: translateX(100%) translateY(-100%) rotate(45deg); }
    }

    .overlay-title {
      margin: 0 0 4px;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .overlay-subtitle {
      margin: 0;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.35);
      font-weight: 400;
    }

    .signal-bar {
      position: relative;
      width: 120px;
      height: 2px;
      margin: 28px auto 0;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 2px;
      overflow: hidden;
    }

    .signal-track {
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 2px;
      animation: trackPulse 2s ease-in-out infinite;
    }

    .signal-dot {
      position: absolute;
      top: 50%;
      width: 6px;
      height: 6px;
      margin-top: -3px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      animation: dotSweep 2s ease-in-out infinite;
    }

    @keyframes trackPulse {
      0%, 100% { transform: scaleX(0.3); transform-origin: left; opacity: 0.3; }
      50% { transform: scaleX(1); transform-origin: center; opacity: 1; }
    }

    @keyframes dotSweep {
      0% { left: 0; }
      50% { left: calc(100% - 6px); }
      100% { left: 0; }
    }
    `,
  ],
})
export class AppComponent implements OnInit {
  readonly connection = inject(ConnectionMonitorService);
  private readonly toastController = inject(ToastController);
  private wasOffline = false;

  constructor() {
    addIcons({
      alertCircleOutline,
      barcodeOutline,
      callOutline,
      calendarOutline,
      carOutline,
      checkmarkCircleOutline,
      checkmarkOutline,
      clipboardOutline,
      closeOutline,
      closeCircleOutline,
      createOutline,
      cubeOutline,
      documentTextOutline,
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
      wifiOutline,
    });

    effect(() => {
      const online = this.connection.isOnline();
      if (online && this.wasOffline) {
        this.wasOffline = false;
        this.showReconnectedToast();
      } else if (!online) {
        this.wasOffline = true;
      }
    });
  }

  ngOnInit(): void {
    this.connection.start();
  }

  private async showReconnectedToast(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Conexión restablecida con el servidor',
      duration: 3000,
      color: 'success',
      position: 'bottom',
    });
    await toast.present();
  }
}
