import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () =>
      import('./pages/tabs/tabs.module').then((m) => m.TabsPageModule),
    canActivate: [authGuard],
  },
  {
    path: 'onboarding',
    loadChildren: () =>
      import('./pages/onboarding/onboarding.module').then(
        (m) => m.OnboardingPageModule,
      ),
  },
  {
    path: 'welcome',
    loadChildren: () =>
      import('./pages/welcome/welcome.module').then((m) => m.WelcomePageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule,
      ),
  },
  {
    path: 'chat',
    loadChildren: () =>
      import('./pages/chat/chat.module').then((m) => m.ChatPageModule),
    canActivate: [authGuard],
  },
  {
    path: 'story/:id',
    loadChildren: () =>
      import('./pages/story-viewer/story-viewer.module').then(
        (m) => m.StoryViewerPageModule,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'post-detail',
    loadChildren: () =>
      import('./pages/post-detail/post-detail.module').then(
        (m) => m.PostDetailPageModule,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'contacts',
    loadChildren: () =>
      import('./pages/contacts/contacts.module').then(
        (m) => m.ContactPageModule,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('./pages/notification/notification.module').then(
        (m) => m.NotificationPageModule,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'comments',
    loadChildren: () =>
      import('./pages/comments/comments.module').then(
        (m) => m.CommentsPageModule,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'events',
    loadChildren: () =>
      import('./pages/events/events.module').then((m) => m.EventsPageModule),
    canActivate: [authGuard],
  },
  {
    path: 'event-detail',
    loadChildren: () =>
      import('./pages/event-detail/event-detail.module').then(
        (m) => m.EventDetailPageModule,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./pages/settings/settings.module').then(
        (m) => m.SettingsPageModule,
      ),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
