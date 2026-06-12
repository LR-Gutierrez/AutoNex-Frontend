import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonNote,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import { VehicleService } from '../../../core/services/vehicle.service';
import { VehicleResponse } from '../../../core/models/vehicle.model';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonNote,
    IonSkeletonText,
    DateFormatPipe,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{ vehicle()?.licensePlate || 'Vehículo' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button [routerLink]="['/vehicles', vehicleId(), 'edit']">
            <ion-icon name="create-outline" slot="icon-only"></ion-icon>
          </ion-button>
          <ion-button (click)="onDelete()" color="danger">
            <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      @if (!vehicle()) {
        <ion-card>
          <ion-card-content>
            <ion-item>
              <ion-label>
                <h2><ion-skeleton-text animated style="width: 60%"></ion-skeleton-text></h2>
                <p><ion-skeleton-text animated style="width: 40%"></ion-skeleton-text></p>
              </ion-label>
            </ion-item>
          </ion-card-content>
        </ion-card>
      } @else {
        <ion-card>
          <ion-card-header>
            <ion-card-title>{{ vehicle()!.brand }} {{ vehicle()!.model }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item>
                <ion-icon name="person-outline" slot="start"></ion-icon>
                <ion-label>Cliente</ion-label>
                <ion-note slot="end" [routerLink]="['/clients', vehicle()!.clientId]" style="cursor: pointer; color: var(--ion-color-primary);">
                  {{ vehicle()!.clientName }}
                </ion-note>
              </ion-item>
              <ion-item>
                <ion-icon name="car-outline" slot="start"></ion-icon>
                <ion-label>Año</ion-label>
                <ion-note slot="end">{{ vehicle()!.year }}</ion-note>
              </ion-item>
              <ion-item>
                <ion-icon name="document-text-outline" slot="start"></ion-icon>
                <ion-label>Placa</ion-label>
                <ion-note slot="end">{{ vehicle()!.licensePlate }}</ion-note>
              </ion-item>
              @if (vehicle()!.vin) {
                <ion-item>
                  <ion-icon name="barcode-outline" slot="start"></ion-icon>
                  <ion-label>VIN</ion-label>
                  <ion-note slot="end">{{ vehicle()!.vin }}</ion-note>
                </ion-item>
              }
              <ion-item>
                <ion-icon name="calendar-outline" slot="start"></ion-icon>
                <ion-label>Registrado</ion-label>
                <ion-note slot="end">{{ vehicle()!.createdAt | dateFormat }}</ion-note>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>
      }
    </ion-content>
  `,
})
export class VehicleDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly vehicleService = inject(VehicleService);

  readonly vehicle = signal<VehicleResponse | null>(null);
  readonly vehicleId = signal(0);

  constructor() {
    addIcons(allIcons);
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.vehicleId.set(id);
    this.loadVehicle(id);
  }

  private loadVehicle(id: number) {
    this.vehicleService.getById(id).subscribe({
      next: (v) => this.vehicle.set(v),
      error: () => this.router.navigate(['/vehicles']),
    });
  }

  onDelete() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Eliminar Vehículo';
    alert.message = '¿Estás seguro de eliminar este vehículo?';
    alert.buttons = [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Eliminar',
        role: 'destructive',
        handler: () => {
          this.vehicleService.delete(this.vehicleId()).subscribe({
            next: () => this.router.navigate(['/vehicles']),
          });
        },
      },
    ];
    document.body.appendChild(alert);
    alert.present();
  }
}
