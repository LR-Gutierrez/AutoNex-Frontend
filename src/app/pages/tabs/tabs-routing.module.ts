import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'live-stream',
        loadChildren: () =>
          import('../live-stream/live-stream.module').then(
            (m) => m.LiveStreamPageModule,
          ),
      },
      {
        path: 'explore',
        loadChildren: () =>
          import('../explore/explore.module').then((m) => m.ExplorePageModule),
      },
      {
        path: 'messages',
        loadChildren: () =>
          import('../messages/messages.module').then(
            (m) => m.MessagesPageModule,
          ),
      },
      {
        path: 'schedule',
        loadChildren: () =>
          import('../schedule/schedule.module').then(
            (m) => m.SchedulePageModule,
          ),
      },
      {
        path: 'event-comments',
        loadChildren: () =>
          import('../event-comments/event-comments.module').then(
            (m) => m.EventCommentsPageModule,
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../profile/profile.module').then((m) => m.ProfilePageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/live-stream',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
