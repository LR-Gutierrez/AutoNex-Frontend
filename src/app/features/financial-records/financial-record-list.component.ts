import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { DatePipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { IonIcon, ModalController } from '@ionic/angular/standalone';
import { FinancialRecordService } from '../../core/services/financial-record.service';
import { FinancialRecordResponse } from '../../core/models/financial-record.model';
import { PageTitleService } from '../../core/services/page-title.service';
import { RefreshService } from '../../core/services/refresh.service';
import { ListShellComponent } from '../../shared/components/list-shell/list-shell.component';
import { ListItemComponent } from '../../shared/components/list-item/list-item.component';
import { EnumLabelPipe } from '../../shared/pipes/enum-label.pipe';
import { FinancialRecordDetailModalComponent } from './financial-record-detail-modal.component';

@Component({
  selector: 'app-financial-record-list',
  standalone: true,
  imports: [ListShellComponent, ListItemComponent, IonIcon, EnumLabelPipe, DatePipe, CurrencyPipe, DecimalPipe],
  template: `
    <app-list-shell
      title="Finanzas"
      subtitle="Gestiona los ingresos y egresos"
      addRoute="/financial-records/new"
      addLabel="Nuevo Registro"
      searchPlaceholder="Buscar por descripción o categoría..."
      [loading]="financialService.loading()"
      [items]="financialService.records()"
      [totalPages]="financialService.pagination()?.totalPages ?? 0"
      [currentPage]="page()"
      emptyIcon="cash-outline"
      emptyMessage="No hay registros financieros."
      emptyAddRoute="/financial-records/new"
      emptyAddLabel="Crear primer registro"
      (search)="onSearch($event)"
      (pageChange)="goToPage($event)"
    >
      @for (record of financialService.records(); track record.id) {
        <app-list-item
          [editLink]="['/financial-records', record.id, 'edit']"
          [deleteMessage]="getDeleteMessage(record.description)"
          (deleteConfirm)="deleteRecord(record.id)"
        >
          <div actions>
            <button
              (click)="viewDetail(record)"
              class="flex items-center justify-center w-9 h-9 rounded-[10px] text-(--app-text-muted) transition-all duration-200 cursor-pointer border-none action-btn"
              title="Ver detalle"
            >
              <ion-icon name="eye-outline" class="text-[18px]"></ion-icon>
            </button>
          </div>
          <h3 class="m-0 text-base font-bold text-(--app-text) text-ellipsis overflow-hidden whitespace-nowrap">
            {{ record.description }}
          </h3>
          <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-(--app-text-muted)">
            <span class="flex items-center gap-1">
              <ion-icon [name]="record.type === 'Income' ? 'trending-up-outline' : 'trending-down-outline'" class="text-[14px]"
                [class.text-green-400]="record.type === 'Income'"
                [class.text-red-400]="record.type !== 'Income'"
              ></ion-icon>
              <span [class.text-green-400]="record.type === 'Income'" [class.text-red-400]="record.type !== 'Income'">
                {{ record.type === 'Income' ? '+' : '-' }}{{ record.amount | currency:'USD':'symbol':'1.2-2' }}
              </span>
            </span>
            @if (record.amountBs != null) {
              <span class="flex items-center gap-1">
                <ion-icon name="swap-horizontal-outline" class="text-[14px] text-emerald-400"></ion-icon>
                <span class="text-emerald-400">Bs. {{ record.amountBs | number:'1.2-2' }}</span>
              </span>
            }
            <span class="flex items-center gap-1">
              <ion-icon name="pricetag-outline" class="text-[14px]"></ion-icon>
              {{ record.category | enumLabel }}
            </span>
            <span class="flex items-center gap-1">
              <ion-icon name="calendar-outline" class="text-[14px]"></ion-icon>
              {{ record.date | date:'dd/MM/yyyy' }}
            </span>
            @if (record.userName) {
              <span class="flex items-center gap-1">
                <ion-icon name="person-outline" class="text-[14px]"></ion-icon>
                {{ record.userName }}
              </span>
            }
          </div>
        </app-list-item>
      }
    </app-list-shell>
  `,
})
export class FinancialRecordListComponent implements OnInit {
  readonly financialService = inject(FinancialRecordService);
  private readonly pageTitle = inject(PageTitleService);
  private readonly refreshService = inject(RefreshService);
  private readonly modalController = inject(ModalController);

  readonly page = signal(1);
  private readonly searchTerm = signal('');

  getDeleteMessage(description: string): string {
    return `¿Eliminar el registro "${description}"? Esta acción no se puede deshacer.`;
  }

  ngOnInit() {
    this.pageTitle.title.set('Finanzas');
    this.pageTitle.subtitle.set('Gestiona los ingresos y egresos');
    this.loadRecords();
    this.refreshService.refresh$.subscribe(() => this.loadRecords());
  }

  private loadRecords() {
    let params = new HttpParams().set('page', this.page().toString());
    const search = this.searchTerm().trim();
    if (search) params = params.set('search', search);
    this.financialService.loadAll(params).subscribe();
  }

  onSearch(value: string) {
    this.searchTerm.set(value);
    this.loadRecords();
  }

  goToPage(p: number) {
    this.page.set(p);
    this.loadRecords();
  }

  async viewDetail(record: FinancialRecordResponse) {
    const modal = await this.modalController.create({
      component: FinancialRecordDetailModalComponent,
      componentProps: { record },
      cssClass: 'payment-modal',
    });
    await modal.present();
  }

  deleteRecord(id: number) {
    this.financialService.delete(id).subscribe({ next: () => this.loadRecords() });
  }
}
