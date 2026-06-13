import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PageTitleService {
  readonly title = signal('Panel de Control');
  readonly subtitle = signal('');
}
