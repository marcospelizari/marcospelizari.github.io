import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TOPIC_GROUPS } from '../../core/data/topics';
import { MenuService } from '../../core/services/menu.service';
import { SearchService } from '../../core/services/search.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  protected readonly groups = TOPIC_GROUPS;
  protected readonly menu = inject(MenuService);
  protected readonly search = inject(SearchService);

  protected onSearch(event: Event): void {
    this.search.query.set((event.target as HTMLInputElement).value);
  }
}
