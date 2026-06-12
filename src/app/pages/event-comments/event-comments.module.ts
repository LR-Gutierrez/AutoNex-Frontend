import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventCommentsPageRoutingModule } from './event-comments-routing.module';

import { EventCommentsPage } from './event-comments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventCommentsPageRoutingModule,
  ],
  declarations: [EventCommentsPage],
})
export class EventCommentsPageModule {}
