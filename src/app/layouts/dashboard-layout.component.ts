import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  IonSplitPane,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonContent,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { TopbarComponent } from '../components/topbar/topbar.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { RefreshService } from '../core/services/refresh.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    IonSplitPane,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    RouterOutlet,
    TopbarComponent,
    SidebarComponent,
  ],
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    ion-split-pane {
      flex: 1;
      --side-width: 280px;
      --side-max-width: 280px;
      --border: 1px solid rgba(255, 255, 255, 0.06);
    }

    ion-menu {
      --width: 280px;
      --max-width: 280px;
      --min-width: 280px;
    }

    .main-pane {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
    }

    ion-header {
      flex-shrink: 0;
    }

    ion-header ion-toolbar {
      --background: linear-gradient(180deg, #161625 0%, #10101b 100%);
      --color: #f3f4fb;
      --border-color: transparent;
      --min-height: 84px;
      --padding-start: 0;
      --padding-end: 0;
      --padding-top: 0;
      --padding-bottom: 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    @media (max-width: 991px) {
      ion-menu {
        --width: min(86vw, 320px);
        --max-width: min(86vw, 320px);
        --min-width: 0;
      }

      ion-header ion-toolbar {
        --min-height: 60px;
      }
    }

    @media (max-width: 767px) {
      ion-header ion-toolbar {
        --min-height: 60px;
      }
    }
  `,
  template: `
    <ion-split-pane contentId="main-content" class="dashboard-theme">
      <ion-menu contentId="main-content" menuId="main-menu" type="overlay">
        <app-sidebar />
      </ion-menu>

      <div class="main-pane" id="main-content">
        <ion-header class="ion-no-border">
          <ion-toolbar>
            <app-topbar />
          </ion-toolbar>
        </ion-header>
        <ion-content class="app-page">
          <ion-refresher slot="fixed" (ionRefresh)="onRefresh($event)">
            <ion-refresher-content></ion-refresher-content>
          </ion-refresher>
          <router-outlet></router-outlet>
        </ion-content>
      </div>
    </ion-split-pane>
  `,
})
export class DashboardLayoutComponent {
  private readonly refreshService = inject(RefreshService);

  onRefresh(event: CustomEvent): void {
    this.refreshService.trigger();
    (event.target as any).complete();
  }
}
