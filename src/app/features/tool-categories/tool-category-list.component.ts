import { Component, inject, OnInit, signal } from '@angular/core';
import { ToolCategoryService } from '../../core/services/tool-category.service';
import { ToolCategoryResponse } from '../../core/models/tool-category.model';
import { PaginationMeta } from '../../core/models/api-response.model';
import { PageTitleService } from '../../core/services/page-title.service';
import { RefreshService } from '../../core/services/refresh.service';
import { ListShellComponent } from '../../shared/components/list-shell/list-shell.component';
import { ListItemComponent } from '../../shared/components/list-item/list-item.component';
import { createListSearch } from '../../shared/utils/list-search.util';

@Component({
  selector: 'app-tool-category-list',
  standalone: true,
  imports: [ListShellComponent, ListItemComponent],
  template: `
    <app-list-shell
      title="Categorías de Herramientas"
      subtitle="Gestiona las categorías para clasificar herramientas"
      addRoute="/tool-categories/new"
      addLabel="Nueva Categoría"
      searchPlaceholder="Buscar por nombre..."
      [loading]="loading()"
      [items]="categories()"
      [totalPages]="pagination()?.totalPages ?? 0"
      [currentPage]="search.page()"
      emptyIcon="folder-outline"
      emptyMessage="No hay datos."
      emptyAddRoute="/tool-categories/new"
      emptyAddLabel="Crear primera categoría"
      (search)="search.onSearch($event)"
      (pageChange)="search.goToPage($event)"
    >
      @for (cat of categories(); track cat.id) {
        <app-list-item
          [editLink]="['/tool-categories', cat.id, 'edit']"
          [deleteMessage]="getDeleteMessage(cat.name)"
          (deleteConfirm)="deleteCategory(cat.id)"
        >
          <h3 class="m-0 text-base font-bold text-(--app-text) text-ellipsis overflow-hidden whitespace-nowrap">
            {{ cat.name }}
          </h3>
        </app-list-item>
      }
    </app-list-shell>
  `,
})
export class ToolCategoryListComponent implements OnInit {
  private readonly categoryService = inject(ToolCategoryService);
  private readonly pageTitle = inject(PageTitleService);
  private readonly refreshService = inject(RefreshService);

  readonly categories = signal<ToolCategoryResponse[]>([]);
  readonly loading = signal(false);
  readonly pagination = signal<PaginationMeta | null>(null);
  readonly search = createListSearch(() => this.loadCategories());

  getDeleteMessage(name: string): string {
    return `¿Eliminar la categoría "${name}"? Esta acción no se puede deshacer.`;
  }

  ngOnInit() {
    this.pageTitle.title.set('Categorías de Herramientas');
    this.pageTitle.subtitle.set('Gestiona las categorías para clasificar herramientas');
    this.loadCategories();
    this.refreshService.refresh$.subscribe(() => this.loadCategories());
  }

  private loadCategories() {
    this.loading.set(true);
    this.categoryService.loadAll(this.search.buildParams()).subscribe({
      next: (res) => {
        this.categories.set(res.items);
        this.pagination.set({
          page: res.page,
          pageSize: res.pageSize,
          totalCount: res.totalCount,
          totalPages: res.totalPages,
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  deleteCategory(id: number) {
    this.categoryService.delete(id).subscribe({ next: () => this.loadCategories() });
  }
}
