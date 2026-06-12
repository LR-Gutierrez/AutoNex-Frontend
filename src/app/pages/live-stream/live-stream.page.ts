import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface RelatedStream {
  title: string;
  channel: string;
  thumbnail: string;
  viewers: string;
}

@Component({
  standalone: false,
  selector: 'app-live-stream',
  templateUrl: './live-stream.page.html',
  styleUrls: ['./live-stream.page.scss'],
})
export class LiveStreamPage implements OnInit {
  // Video URL
  videoId = 'jfKfPfyJRdk';
  videoUrl!: SafeResourceUrl;

  // Stream Info
  streamTitle = 'Company Annual Meeting 2025 - Live Presentation';
  streamDescription =
    'Join us for our annual company meeting where we will discuss the achievements of 2024 and our exciting plans for 2025. Topics include: Q4 results, new product launches, team expansion, and strategic initiatives. All employees are welcome to participate and ask questions during the Q&A session.';
  streamStartTime = '30 minutes ago';
  channelName = 'Corporate Events';
  channelAvatar = 'https://i.pravatar.cc/150?img=20';
  subscriberCount = '12.5K';

  // Stats
  viewerCount = 1247;
  likes = 856;
  commentCount = 342;

  // UI State
  isFullscreen = false;
  isPlaying = true;
  descriptionExpanded = false;

  // Related Streams
  relatedStreams: RelatedStream[] = [
    {
      title: 'Product Launch Event - New Features Demo',
      channel: 'Tech Department',
      thumbnail: 'https://picsum.photos/320/180?random=1',
      viewers: '856',
    },
    {
      title: 'Q&A Session with CEO',
      channel: 'Executive Team',
      thumbnail: 'https://picsum.photos/320/180?random=2',
      viewers: '623',
    },
    {
      title: 'Team Building Workshop',
      channel: 'HR Department',
      thumbnail: 'https://picsum.photos/320/180?random=3',
      viewers: '445',
    },
  ];

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadVideo();
    this.startViewerCountUpdate();
  }

  loadVideo() {
    const embedUrl = `https://www.youtube.com/embed/${this.videoId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;

    if (this.isFullscreen) {
      const header = document.querySelector('ion-header');
      const tabBar = document.querySelector('ion-tab-bar');
      if (header) (header as HTMLElement).style.display = 'none';
      if (tabBar) (tabBar as HTMLElement).style.display = 'none';
    } else {
      const header = document.querySelector('ion-header');
      const tabBar = document.querySelector('ion-tab-bar');
      if (header) (header as HTMLElement).style.display = 'block';
      if (tabBar) (tabBar as HTMLElement).style.display = 'flex';
    }
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
  }

  startViewerCountUpdate() {
    setInterval(() => {
      const change = Math.floor(Math.random() * 20) - 10;
      this.viewerCount = Math.max(1000, this.viewerCount + change);
    }, 5000);
  }

  goToComments() {
    this.router.navigate(['/tabs/event-comments']);
  }

  goToSchedule() {
    this.router.navigate(['/tabs/schedule']);
  }

  ionViewWillLeave() {
    if (this.isFullscreen) {
      this.toggleFullscreen();
    }
  }
}
