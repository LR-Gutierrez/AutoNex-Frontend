import { Component, inject, OnInit } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { ToolService } from '../../core/services/tool.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { RefreshService } from '../../core/services/refresh.service';
import { ListShellComponent } from '../../shared/components/list-shell/list-shell.component';
import { ListItemComponent } from '../../shared/components/list-item/list-item.component';
import { EnumLabelPipe } from '../../shared/pipes/enum-label.pipe';
import { createListSearch } from '../../shared/utils/list-search.util';

@Component({
  selector: 'app-tool-list',
  standalone: true,
  imports: [ListShellComponent, ListItemComponent, IonIcon, EnumLabelPipe],
  template: `
    <app-list-shell
      title="Herramientas"
      subtitle="Gestiona las herramientas del taller"
      addRoute="/tools/new"
      addLabel="Nueva Herramienta"
      searchPlaceholder="Buscar por nombre, categoría o estado..."
      [loading]="toolService.loading()"
      [items]="toolService.tools()"
      [totalPages]="toolService.pagination()?.totalPages ?? 0"
      [currentPage]="search.page()"
      emptyIcon="build-outline"
      emptyMessage="No hay herramientas registradas."
      emptyAddRoute="/tools/new"
      emptyAddLabel="Crear primera herramienta"
      (search)="search.onSearch($event)"
      (pageChange)="search.goToPage($event)"
    >
      @for (tool of toolService.tools(); track tool.id) {
        <app-list-item
          [editLink]="['/tools', tool.id, 'edit']"
          [deleteMessage]="getDeleteMessage(tool.name)"
          (deleteConfirm)="deleteTool(tool.id)"
        >
          <h3 class="m-0 text-base font-bold text-(--app-text) text-ellipsis overflow-hidden whitespace-nowrap">
            {{ tool.name }}
          </h3>
          <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-(--app-text-muted)">
            <span class="flex items-center gap-1">
              <ion-icon name="folder-outline" class="text-[14px]"></ion-icon>
              {{ tool.toolCategoryName }}
            </span>
            <span class="flex items-center gap-1">
              <ion-icon name="layers-outline" class="text-[14px]"></ion-icon>
              Cantidad: {{ tool.quantity }}
            </span>
            <span class="flex items-center gap-1">
              <ion-icon name="checkmark-circle-outline" class="text-[14px]"></ion-icon>
              {{ tool.status | enumLabel }}
            </span>
          </div>
        </app-list-item>
      }
    </app-list-shell>
  `,
})
export class ToolListComponent implements OnInit {
  readonly toolService = inject(ToolService);
  private readonly pageTitle = inject(PageTitleService);
  private readonly refreshService = inject(RefreshService);

  readonly search = createListSearch();

  getDeleteMessage(name: string): string {
    return `¿Eliminar la herramienta "${name}"? Esta acción no se puede deshacer.`;
  }

  ngOnInit() {
    this.pageTitle.title.set('Herramientas');
    this.pageTitle.subtitle.set('Gestiona las herramientas del taller');
    this.loadTools();
    this.refreshService.refresh$.subscribe(() => this.loadTools());
  }

  private loadTools() {
    this.toolService.loadAll(this.search.buildParams()).subscribe();
  }

  deleteTool(id: number) {
    this.toolService.delete(id).subscribe({ next: () => this.loadTools() });
  }
}
