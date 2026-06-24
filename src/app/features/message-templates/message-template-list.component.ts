import { Component, inject, OnInit } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentTextOutline, createOutline } from 'ionicons/icons';
import { MessageTemplateService } from '../../core/services/message-template.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { RefreshService } from '../../core/services/refresh.service';
import { ListShellComponent } from '../../shared/components/list-shell/list-shell.component';
import { ListItemComponent } from '../../shared/components/list-item/list-item.component';
import { createListSearch } from '../../shared/utils/list-search.util';

@Component({
  selector: 'app-message-template-list',
  standalone: true,
  imports: [ListShellComponent, ListItemComponent, IonIcon],
  template: `
    <app-list-shell
      title="Plantillas de Mensajes"
      subtitle="Personaliza los mensajes que se envían por WhatsApp"
      addRoute="/message-templates/new"
      addLabel="Nueva Plantilla"
      searchPlaceholder="Buscar por clave o descripción..."
      [loading]="templateService.loading()"
      [items]="templateService.templates()"
      [totalPages]="templateService.pagination()?.totalPages ?? 0"
      [currentPage]="search.page()"
      emptyIcon="document-text-outline"
      emptyMessage="No hay plantillas personalizadas."
      emptyAddRoute="/message-templates/new"
      emptyAddLabel="Crear primera plantilla"
      (search)="search.onSearch($event)"
      (pageChange)="search.goToPage($event)"
    >
      @for (template of templateService.templates(); track template.id) {
        <app-list-item
          [editLink]="['/message-templates', template.id, 'edit']"
          [deleteMessage]="getDeleteMessage(template.key)"
          (deleteConfirm)="deleteTemplate(template.id)"
        >
          <h3 class="m-0 text-base font-bold text-(--app-text) text-ellipsis overflow-hidden whitespace-nowrap">
            {{ template.key }}
          </h3>
          <div class="flex flex-col gap-1 mt-2 text-xs text-(--app-text-muted)">
            @if (template.description) {
              <span class="flex items-center gap-1">
                <ion-icon name="information-circle-outline" class="text-[14px]"></ion-icon>
                {{ template.description }}
              </span>
            }
            <span class="flex items-start gap-1">
              <ion-icon name="create-outline" class="text-[14px] mt-0.5 shrink-0"></ion-icon>
              <span class="line-clamp-2">{{ template.template }}</span>
            </span>
          </div>
        </app-list-item>
      }
    </app-list-shell>
  `,
})
export class MessageTemplateListComponent implements OnInit {
  readonly templateService = inject(MessageTemplateService);
  private readonly pageTitle = inject(PageTitleService);
  private readonly refreshService = inject(RefreshService);

  readonly search = createListSearch(() => this.loadTemplates());

  constructor() {
    addIcons({ documentTextOutline, createOutline });
  }

  getDeleteMessage(key: string): string {
    return `¿Eliminar la plantilla "${key}"? Esta acción no se puede deshacer.`;
  }

  ngOnInit() {
    this.pageTitle.title.set('Plantillas de Mensajes');
    this.pageTitle.subtitle.set('Personaliza los mensajes que se envían por WhatsApp');
    this.loadTemplates();
    this.refreshService.refresh$.subscribe(() => this.loadTemplates());
  }

  private loadTemplates() {
    this.templateService.loadAll(this.search.buildParams()).subscribe();
  }

  deleteTemplate(id: number) {
    this.templateService.delete(id).subscribe({ next: () => this.loadTemplates() });
  }
}
