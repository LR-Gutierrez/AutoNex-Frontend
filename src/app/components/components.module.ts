import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedCardComponent } from './feed-card/feed-card.component';
import { IonicModule } from '@ionic/angular';
import { StoryAvatarComponent } from './story-avatar/story-avatar.component';
import { StoryCardComponent } from './story-card/story-card.component';
import { UtilsModule } from '../utils/utils.module';
import { MessageListItemComponent } from './message-list-item/message-list-item.component';
import { ContactCardComponent } from './contact-card/contact-card.component';
import { CommentItemComponent } from './comment-item/comment-item.component';
import { NotificationItemComponent } from './notification-item/notification-item.component';
import { GroupCardComponent } from './group-card/group-card.component';
import { EventCardComponent } from './event-card/event-card.component';
import { FollowCardComponent } from './follow-card/follow-card.component';

@NgModule({
  declarations: [
    FeedCardComponent,
    StoryAvatarComponent,
    StoryCardComponent,
    MessageListItemComponent,
    ContactCardComponent,
    CommentItemComponent,
    NotificationItemComponent,
    GroupCardComponent,
    EventCardComponent,
    FollowCardComponent,
  ],
  imports: [CommonModule, IonicModule, UtilsModule],
  exports: [
    FeedCardComponent,
    StoryAvatarComponent,
    StoryCardComponent,
    MessageListItemComponent,
    ContactCardComponent,
    CommentItemComponent,
    NotificationItemComponent,
    GroupCardComponent,
    EventCardComponent,
    FollowCardComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}
