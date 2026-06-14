import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RefreshService {
  private readonly refreshSource = new Subject<void>();
  readonly refresh$ = this.refreshSource.asObservable();

  trigger(): void {
    this.refreshSource.next();
  }
}
