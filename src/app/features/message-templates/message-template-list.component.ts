import { Component, inject, OnInit } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentTextOutline, createOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { AlertController, ToastController } from '@ionic/angular';
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
          <div class="flex items-center gap-2">
            <h3 class="m-0 text-sm font-bold text-(--app-text) text-ellipsis overflow-hidden whitespace-nowrap">
              {{ template.key }}
            </h3>
            @if (template.isActive) {
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold leading-relaxed bg-[rgba(52,211,153,0.12)] text-[#4ade80] border border-[rgba(52,211,153,0.25)]">
                <ion-icon name="checkmark-circle-outline" class="text-[13px]"></ion-icon>
                Activa
              </span>
            }
          </div>
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

          @if (!template.isActive) {
            <button actions
              (click)="activateTemplate(template.id, template.key)"
              class="flex items-center justify-center w-9 h-9 rounded-[10px] text-(--app-text-muted) transition-all duration-200 cursor-pointer border-none icon-btn hover:!bg-[rgba(52,211,153,0.12)] hover:!text-[#4ade80]"
              title="Activar como template oficial"
            >
              <ion-icon name="checkmark-circle-outline" class="text-[18px]"></ion-icon>
            </button>
          }
        </app-list-item>
      }
    </app-list-shell>
  `,
})
export class MessageTemplateListComponent implements OnInit {
  readonly templateService = inject(MessageTemplateService);
  private readonly pageTitle = inject(PageTitleService);
  private readonly refreshService = inject(RefreshService);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);

  readonly search = createListSearch(() => this.loadTemplates());

  constructor() {
    addIcons({ documentTextOutline, createOutline, checkmarkCircleOutline });
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

  async activateTemplate(id: number, key: string) {
    const alert = await this.alertController.create({
      header: 'Activar plantilla',
      message: `¿Estás seguro de activar la plantilla "${key}"? La plantilla actual será desactivada.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Activar',
          role: 'confirm',
          handler: () => {
            this.templateService.setActive(id).subscribe({
              next: async () => {
                this.loadTemplates();
                (
                  await this.toastController.create({
                    message: `Plantilla "${key}" activada como oficial`,
                    duration: 3000,
                    color: 'success',
                    position: 'bottom',
                  })
                ).present();
              },
              error: async (err) => {
                (
                  await this.toastController.create({
                    message: err.error?.message ?? 'Error al activar plantilla',
                    duration: 3000,
                    color: 'danger',
                    position: 'bottom',
                  })
                ).present();
              },
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
