import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE_CONFIG } from '../../core/config/site.config';
import { MenuService } from '../../core/services/menu.service';
import { SearchService } from '../../core/services/search.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  host: {
    '(document:keydown.control.k)': 'focusSearch($event)',
    '(document:keydown.meta.k)': 'focusSearch($event)',
  },
})
export class Header {
  protected readonly site = SITE_CONFIG;
  protected readonly menu = inject(MenuService);
  protected readonly search = inject(SearchService);
  protected readonly theme = inject(ThemeService);
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  protected onSearch(event: Event): void {
    this.search.query.set((event.target as HTMLInputElement).value);
  }

  protected focusSearch(event: Event): void {
    event.preventDefault();
    this.searchInput()?.nativeElement.focus();
  }
}
