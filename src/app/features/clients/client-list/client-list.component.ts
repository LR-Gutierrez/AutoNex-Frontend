import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
import { ClientService } from '../../../core/services/client.service';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-client-list',
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
        <ion-title>Clientes</ion-title>
        <ion-buttons slot="end">
          <ion-button routerLink="/clients/new">
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
                     placeholder="Buscar por nombre o teléfono..."
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
      } @else if (clients().length === 0) {
        <app-empty-state icon="people-outline" message="No se encontraron clientes"></app-empty-state>
      } @else {
        <ion-list>
          @for (client of clients(); track client.id) {
            <ion-item [routerLink]="['/clients', client.id]" detail>
              <ion-label>
                <h2>{{ client.fullName }}</h2>
                <p>{{ client.phone }}@if (client.email) { — {{ client.email }} }</p>
              </ion-label>
              <ion-note slot="end">{{ client.createdAt | dateFormat }}</ion-note>
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
export class ClientListComponent implements OnInit {
  private readonly clientService = inject(ClientService);

  readonly clients = this.clientService.clients;
  readonly loading = this.clientService.loading;
  readonly searchTerm = signal('');
  readonly page = signal(1);
  readonly hasMore = signal(true);

  constructor() {
    addIcons(allIcons);
  }

  ngOnInit() {
    this.loadClients();
  }

  private loadClients() {
    let params = new HttpParams().set('page', this.page().toString());
    const search = this.searchTerm();
    if (search) {
      params = params.set('search', search);
    }
    this.clientService.loadAll(params).subscribe({
      error: () => { },
    });
  }

  onSearch(event: CustomEvent) {
    this.searchTerm.set(event.detail.value || '');
    this.page.set(1);
    this.loadClients();
  }

  loadMore(event: CustomEvent) {
    this.page.update(p => p + 1);
    this.loadClients();
    (event.target as HTMLIonInfiniteScrollElement).complete();
  }

  onRefresh(event: CustomEvent) {
    this.page.set(1);
    this.loadClients();
    (event.target as HTMLIonRefresherElement).complete();
  }
}
