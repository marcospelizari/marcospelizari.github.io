import { Routes } from '@angular/router';
import { TopicPage } from './features/topic/topic-page';
import { DEFAULT_TOPIC, findTopic, firstLevel } from './core/data/topics';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: DEFAULT_TOPIC },
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
