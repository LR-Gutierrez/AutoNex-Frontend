import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AuthStateService } from './core/services/auth-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);

  constructor() {
    if (this.authState.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }
}
