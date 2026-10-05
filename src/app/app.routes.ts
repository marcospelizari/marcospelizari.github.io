import { Routes } from '@angular/router';
import { HomePage } from './features/home/home-page';
import { TopicPage } from './features/topic/topic-page';
import { findTopic, firstLevel } from './core/data/topics';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomePage },
  {
    path: ':slug',
    pathMatch: 'full',
    redirectTo: ({ params }) => {
      const entry = findTopic(params['slug']);
      return entry ? `/${entry.topic.slug}/${firstLevel(entry.topic)}` : `/${params['slug']}/essencial`;
    },
  },
  { path: ':slug/:level', component: TopicPage },
  { path: '**', redirectTo: '' },
];
