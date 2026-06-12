import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { interval, Subject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  standalone: false,
  selector: 'app-story-viewer',
  templateUrl: './story-viewer.page.html',
  styleUrls: ['./story-viewer.page.scss'],
})
export class StoryViewerPage implements OnInit, OnDestroy {
  @ViewChild('swiperEl', { static: false }) swiperRef!: ElementRef;

  stories: any;
  currentUserHistoryIndex = 0;
  duration = 0;
  currentHist = 0;

  commentForm!: FormGroup;
  progressTime = 0;
  unsubscribe$ = new Subject<void>();
  slideOpts: any;

  constructor(
    private fb: FormBuilder,
    private platform: Platform,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dataService: DataService,
  ) {}

  get swiper(): any {
    return this.swiperRef?.nativeElement?.swiper;
  }

  ngOnInit() {
    const position: any = this.activatedRoute.snapshot.paramMap.get('id');
    this.slideOpts = {
      initialSlide: position,
      allowTouchMove: false,
    };
    this.stories = this.dataService.getHistories();

    this.commentForm = this.fb.group({
      comment: [null],
    });

    if (!this.stories[position].seen) {
      this.currentUserHistoryIndex = this.stories[position].items.findIndex(
        (item: any) => !item.seen,
      );
      this.duration =
        this.stories[position].items[this.currentUserHistoryIndex].duration;
    } else {
      this.duration = this.stories[position].items[0].duration;
    }
    this.runStory();
  }

  runStory() {
    interval(100)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        if (this.progressTime < 1) {
          this.progressTime += 0.1 / this.duration;
        } else {
          this.progressTime = 0;
          this.nextStoryScreen();
        }
      });
  }

  async nextStoryScreen() {
    let activeIndex = this.swiper?.activeIndex ?? 0;

    this.stories[activeIndex].items[this.currentUserHistoryIndex].seen = true;
    this.currentUserHistoryIndex++;

    if (
      this.currentUserHistoryIndex == this.stories[activeIndex].items.length &&
      activeIndex == this.stories.length - 1
    ) {
      this.stories[activeIndex].seen = true;
      this.stories[activeIndex].items = this.stories[activeIndex].items.map(
        (item: any) => {
          item.seen = false;
          return item;
        },
      );
      this.close();
    }

    if (
      this.currentUserHistoryIndex == this.stories[activeIndex].items.length
    ) {
      this.currentUserHistoryIndex = 0;
      this.stories[activeIndex].seen = true;
      this.stories[activeIndex].items = this.stories[activeIndex].items.map(
        (item: any) => {
          item.seen = false;
          return item;
        },
      );
      this.swiper?.slideNext();
    }

    activeIndex = this.swiper?.activeIndex ?? 0;
    this.duration =
      this.stories[activeIndex].items[this.currentUserHistoryIndex].duration;
  }

  async onClick(event: any) {
    this.progressTime = 0;
    if (event.clientX < this.platform.width() / 2) {
      let activeIndex = this.swiper?.activeIndex ?? 0;

      if (activeIndex == 0 && this.currentUserHistoryIndex == 0) {
        this.currentUserHistoryIndex = 0;
        this.close();
        return;
      }

      if (this.currentUserHistoryIndex > 0) {
        this.currentUserHistoryIndex--;
        this.stories[activeIndex].items[this.currentUserHistoryIndex].seen =
          false;
        activeIndex = this.swiper?.activeIndex ?? 0;
        this.duration =
          this.stories[activeIndex].items[
            this.currentUserHistoryIndex
          ].duration;
        return;
      }

      if (
        this.currentUserHistoryIndex == 0 &&
        this.stories[activeIndex - 1].seen
      ) {
        this.stories[activeIndex - 1].items = this.stories[
          activeIndex - 1
        ].items.map((item: any) => {
          item.seen = false;
          return item;
        });
        this.swiper?.slidePrev();
        activeIndex = this.swiper?.activeIndex ?? 0;
        this.duration =
          this.stories[activeIndex].items[
            this.currentUserHistoryIndex
          ].duration;
        return;
      }

      if (
        this.currentUserHistoryIndex == 0 &&
        !this.stories[activeIndex - 1].seen
      ) {
        this.stories[activeIndex - 1].items[this.currentUserHistoryIndex].seen =
          false;
        this.swiper?.slidePrev();
        activeIndex = this.swiper?.activeIndex ?? 0;
        this.duration =
          this.stories[activeIndex].items[
            this.currentUserHistoryIndex
          ].duration;
      }
    } else {
      this.nextStoryScreen();
    }
  }

  close() {
    this.dataService.getSeenFirtsHistories();
    this.router.navigate(['/tabs/live-stream']);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  submitComment() {}
}
