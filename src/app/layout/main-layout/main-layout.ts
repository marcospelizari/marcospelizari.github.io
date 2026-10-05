import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuService } from '../../core/services/menu.service';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';

/** App shell: fixed header, sidebar (drawer on mobile) and the routed page. */
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './main-layout.html',
  host: { '(document:keydown.escape)': 'menu.close()' },
})
export class MainLayout {
  protected readonly menu = inject(MenuService);
}
