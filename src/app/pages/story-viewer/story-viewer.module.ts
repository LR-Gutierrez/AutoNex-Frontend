import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoryViewerPageRoutingModule } from './story-viewer-routing.module';

import { StoryViewerPage } from './story-viewer.page';
import { UtilsModule } from 'src/app/utils/utils.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    StoryViewerPageRoutingModule,
    UtilsModule,
    ComponentsModule,
    FormsModule,
  ],
  declarations: [StoryViewerPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StoryViewerPageModule {}
