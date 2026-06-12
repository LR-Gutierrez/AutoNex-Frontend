import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonSearchbar,
  IonRefresher,
  IonRefresherContent,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonSkeletonText,
  IonIcon,
  IonButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import { VehicleService } from '../../../core/services/vehicle.service';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonMenuButton,
    IonSearchbar,
    IonRefresher,
    IonRefresherContent,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonSkeletonText,
    IonIcon,
    IonButton,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    DateFormatPipe,
    EmptyStateComponent,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Vehículos</ion-title>
        <ion-buttons slot="end">
          <ion-button routerLink="/vehicles/new">
            <ion-icon name="add" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" (ionRefresh)="onRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-searchbar [(ngModel)]="searchTerm"
                     (ionInput)="onSearch($event)"
                     placeholder="Buscar por placa o cliente..."
                     debounce="300">
      </ion-searchbar>

      @if (loading()) {
        <ion-list>
          @for (_ of [1,2,3,4,5]; track $index) {
            <ion-item>
              <ion-label>
                <h2><ion-skeleton-text animated style="width: 60%"></ion-skeleton-text></h2>
                <p><ion-skeleton-text animated style="width: 40%"></ion-skeleton-text></p>
              </ion-label>
            </ion-item>
          }
        </ion-list>
      } @else if (vehicles().length === 0) {
        <app-empty-state icon="car-outline" message="No se encontraron vehículos"></app-empty-state>
      } @else {
        <ion-list>
          @for (v of vehicles(); track v.id) {
            <ion-item [routerLink]="['/vehicles', v.id]" detail>
              <ion-label>
                <h2>{{ v.brand }} {{ v.model }} ({{ v.year }})</h2>
                <p>{{ v.licensePlate }} — {{ v.clientName }}</p>
              </ion-label>
              <ion-note slot="end">{{ v.createdAt | dateFormat }}</ion-note>
            </ion-item>
          }
        </ion-list>

        @if (hasMore()) {
          <ion-infinite-scroll (ionInfinite)="loadMore($event)">
            <ion-infinite-scroll-content></ion-infinite-scroll-content>
          </ion-infinite-scroll>
        }
      }
    </ion-content>
  `,
})
export class VehicleListComponent implements OnInit {
  private readonly vehicleService = inject(VehicleService);

  readonly vehicles = this.vehicleService.vehicles;
  readonly loading = this.vehicleService.loading;
  readonly searchTerm = signal('');
  readonly page = signal(1);
  readonly hasMore = signal(true);

  constructor() {
    addIcons(allIcons);
  }

  ngOnInit() {
    this.loadVehicles();
  }

  private loadVehicles() {
    let params = new HttpParams().set('page', this.page().toString());
    const search = this.searchTerm();
    if (search) {
      params = params.set('search', search);
    }
    this.vehicleService.loadAll(params).subscribe({ error: () => {} });
  }

  onSearch(event: CustomEvent) {
    this.searchTerm.set(event.detail.value || '');
    this.page.set(1);
    this.loadVehicles();
  }

  loadMore(event: CustomEvent) {
    this.page.update(p => p + 1);
    this.loadVehicles();
    (event.target as HTMLIonInfiniteScrollElement).complete();
  }

  onRefresh(event: CustomEvent) {
    this.page.set(1);
    this.loadVehicles();
    (event.target as HTMLIonRefresherElement).complete();
  }
}
