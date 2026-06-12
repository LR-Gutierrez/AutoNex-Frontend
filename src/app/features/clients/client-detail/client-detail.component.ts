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
  IonAlert,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import { ClientService } from '../../../core/services/client.service';
import { ClientResponse } from '../../../core/models/client.model';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-client-detail',
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
        <ion-title>{{ client()?.fullName || 'Cliente' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button [routerLink]="['/clients', clientId(), 'edit']">
            <ion-icon name="create-outline" slot="icon-only"></ion-icon>
          </ion-button>
          <ion-button (click)="onDelete()" color="danger">
            <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      @if (!client()) {
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
            <ion-card-title>{{ client()!.fullName }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item>
                <ion-icon name="call-outline" slot="start"></ion-icon>
                <ion-label>Teléfono</ion-label>
                <ion-note slot="end">{{ client()!.phone }}</ion-note>
              </ion-item>
              @if (client()!.email) {
                <ion-item>
                  <ion-icon name="mail-outline" slot="start"></ion-icon>
                  <ion-label>Email</ion-label>
                  <ion-note slot="end">{{ client()!.email }}</ion-note>
                </ion-item>
              }
              @if (client()!.address) {
                <ion-item>
                  <ion-icon name="location-outline" slot="start"></ion-icon>
                  <ion-label>Dirección</ion-label>
                  <ion-note slot="end">{{ client()!.address }}</ion-note>
                </ion-item>
              }
              <ion-item>
                <ion-icon name="calendar-outline" slot="start"></ion-icon>
                <ion-label>Registrado</ion-label>
                <ion-note slot="end">{{ client()!.createdAt | dateFormat }}</ion-note>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Vehículos</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            @if (!client()!.vehicles || client()!.vehicles!.length === 0) {
              <p class="text-gray-500 text-center py-4">Sin vehículos registrados</p>
            } @else {
              <ion-list>
                @for (v of client()!.vehicles; track v.id) {
                  <ion-item [routerLink]="['/vehicles', v.id]" detail>
                    <ion-icon name="car-outline" slot="start"></ion-icon>
                    <ion-label>
                      <h2>{{ v.brand }} {{ v.model }} ({{ v.year }})</h2>
                      <p>{{ v.licensePlate }}</p>
                    </ion-label>
                  </ion-item>
                }
              </ion-list>
            }
          </ion-card-content>
        </ion-card>
      }
    </ion-content>
  `,
})
export class ClientDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly clientService = inject(ClientService);

  readonly client = signal<ClientResponse | null>(null);
  readonly clientId = signal(0);

  constructor() {
    addIcons(allIcons);
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.clientId.set(id);
    this.loadClient(id);
  }

  private loadClient(id: number) {
    this.clientService.getById(id).subscribe({
      next: (client) => this.client.set(client),
      error: () => this.router.navigate(['/clients']),
    });
  }

  onDelete() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Eliminar Cliente';
    alert.message = '¿Estás seguro de eliminar este cliente?';
    alert.buttons = [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Eliminar',
        role: 'destructive',
        handler: () => {
          this.clientService.delete(this.clientId()).subscribe({
            next: () => this.router.navigate(['/clients']),
          });
        },
      },
    ];
    document.body.appendChild(alert);
    alert.present();
  }
}
