import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventCommentsPage } from './event-comments.page';

const routes: Routes = [
  {
    path: '',
    component: EventCommentsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventCommentsPageRoutingModule {}
