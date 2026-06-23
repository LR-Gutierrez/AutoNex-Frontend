import { signal } from '@angular/core';
import { HttpParams } from '@angular/common/http';

export interface ListSearch {
  readonly page: ReturnType<typeof signal<number>>;
  readonly searchTerm: ReturnType<typeof signal<string>>;
  onSearch(value: string): void;
  goToPage(p: number): void;
  buildParams(): HttpParams;
}

export function createListSearch(): ListSearch {
  const page = signal(1);
  const searchTerm = signal('');

  function buildParams(): HttpParams {
    let params = new HttpParams().set('page', page().toString());
    const search = searchTerm().trim();
    if (search) params = params.set('search', search);
    return params;
  }

  function onSearch(value: string) {
    searchTerm.set(value);
    page.set(1);
  }

  function goToPage(p: number) {
    page.set(p);
  }

  return { page, searchTerm, onSearch, goToPage, buildParams };
}
