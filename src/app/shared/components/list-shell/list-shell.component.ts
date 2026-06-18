import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { IonIcon, IonSkeletonText } from '@ionic/angular/standalone';
import { AddButtonComponent } from '../add-button/add-button.component';
import { addIcons } from 'ionicons';
import {
  searchOutline,
  chevronBackOutline,
  chevronForwardOutline,
  folderOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-list-shell',
  standalone: true,
  imports: [IonIcon, IonSkeletonText, AddButtonComponent],
  styles: `
    :host {
      display: block;
      --card-bg: linear-gradient(
        180deg,
        rgba(30, 32, 52, 0.96),
        rgba(24, 25, 42, 0.96)
      );
    }
  `,
  template: `
    <div class="p-5 max-md:p-3.5 text-(--app-text) box-border">
      <section class="mb-5 flex items-start justify-between gap-4 max-md:flex-col">
        <div>
          <h1 class="m-0 text-[34px] max-md:text-[28px] leading-[1.1] font-extrabold tracking-[-0.03em]">
            {{ title }}
          </h1>
          @if (subtitle) {
            <p class="mt-1.5 text-(--app-text-muted) text-sm">{{ subtitle }}</p>
          }
        </div>
        @if (addRoute) {
          <app-add-button [route]="addRoute" [label]="addLabel"></app-add-button>
        }
      </section>

      <div class="flex items-center gap-4 mb-5 max-md:flex-col">
        <div class="relative flex-1 w-full">
          <ion-icon
            name="search-outline"
            class="absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-(--app-text-muted) z-10"
          ></ion-icon>
          <input
            [value]="searchTerm()"
            (input)="onSearch($event)"
            [placeholder]="searchPlaceholder"
            class="w-full h-[48px] bg-[rgba(255,255,255,0.05)] border border-(--app-border) rounded-[12px] pl-11 pr-4 text-sm text-(--app-text) outline-none transition-all duration-300 focus:bg-[rgba(255,255,255,0.08)] focus:border-[rgba(211,29,29,0.5)]"
          />
        </div>
      </div>

      @if (loading) {
        <div class="grid gap-3">
          @for (_ of skeletonArray; track $index) {
            <div class="bg-(--card-bg) border border-(--app-border) rounded-2xl p-4.5">
              <ion-skeleton-text animated class="w-[55%]! h-5!"></ion-skeleton-text>
              <ion-skeleton-text animated class="w-[35%]! h-3.5! mt-2.5"></ion-skeleton-text>
              <ion-skeleton-text animated class="w-[25%]! h-3.5! mt-2"></ion-skeleton-text>
            </div>
          }
        </div>
      } @else if (items.length === 0) {
        <div class="bg-(--card-bg) border border-(--app-border) rounded-[18px] p-10 text-center">
          <ion-icon [name]="emptyIcon" class="text-[48px] text-(--app-text-muted) mb-4"></ion-icon>
          <p class="text-(--app-text-muted) text-sm m-0">{{ emptyMessage }}</p>
          @if (emptyAddRoute || addRoute) {
            <app-add-button
              [route]="emptyAddRoute || addRoute"
              [label]="emptyAddLabel || addLabel"
            ></app-add-button>
          }
        </div>
      } @else {
        <div class="grid gap-3">
          <ng-content></ng-content>
        </div>

        @if (totalPages > 1) {
          <div class="flex items-center justify-center gap-2 mt-5">
            <button
              [disabled]="currentPage <= 1"
              (click)="goToPage(currentPage - 1)"
              class="flex items-center gap-1 px-3.5 py-2 rounded-[10px] text-sm font-bold transition-all duration-200 cursor-pointer border-none disabled:opacity-30 disabled:cursor-not-allowed bg-[rgba(255,255,255,0.06)] text-(--app-text-muted) hover:bg-[rgba(255,255,255,0.1)]"
            >
              <ion-icon name="chevron-back-outline" class="text-[16px]"></ion-icon>
              Anterior
            </button>

            <span class="text-sm text-(--app-text-muted) px-3">
              {{ currentPage }} de {{ totalPages }}
            </span>

            <button
              [disabled]="currentPage >= totalPages"
              (click)="goToPage(currentPage + 1)"
              class="flex items-center gap-1 px-3.5 py-2 rounded-[10px] text-sm font-bold transition-all duration-200 cursor-pointer border-none disabled:opacity-30 disabled:cursor-not-allowed bg-[rgba(255,255,255,0.06)] text-(--app-text-muted) hover:bg-[rgba(255,255,255,0.1)]"
            >
              Siguiente
              <ion-icon name="chevron-forward-outline" class="text-[16px]"></ion-icon>
            </button>
          </div>
        }
      }
    </div>
  `,
})
export class ListShellComponent {
  constructor() {
    addIcons({ searchOutline, chevronBackOutline, chevronForwardOutline, folderOutline });
  }

  @Input({ required: true }) title!: string;
  @Input() subtitle = '';
  @Input() addRoute = '';
  @Input() addLabel = '';
  @Input() searchPlaceholder = 'Buscar...';
  @Input() loading = false;
  @Input() items: unknown[] = [];
  @Input() totalPages = 0;
  @Input() currentPage = 1;
  @Input() skeletonCount = 5;

  get skeletonArray(): number[] {
    return Array(this.skeletonCount).fill(0);
  }
  @Input() emptyIcon = 'folder-outline';
  @Input() emptyMessage = 'No hay datos.';
  @Input() emptyAddRoute?: string;
  @Input() emptyAddLabel?: string;

  @Output() search = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();

  readonly searchTerm = signal('');

  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.pageChange.emit(1);
      this.search.emit(value);
    }, 400);
  }

  goToPage(p: number) {
    this.pageChange.emit(p);
  }
}
