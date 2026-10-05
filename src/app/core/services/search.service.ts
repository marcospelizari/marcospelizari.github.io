import { Injectable, signal } from '@angular/core';

/** Search query typed in the header; filters the sections of the open topic. */
@Injectable({ providedIn: 'root' })
export class SearchService {
  readonly query = signal('');
}
