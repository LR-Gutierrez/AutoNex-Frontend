import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

interface Comment {
  id: string;
  userName: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
  liked: boolean;
  replies?: Reply[];
}

interface Reply {
  userName: string;
  avatar: string;
  text: string;
  time: string;
}

interface CurrentEvent {
  title: string;
  location: string;
  duration: string;
  attendees: number;
  status: string;
}

@Component({
  standalone: false,
  selector: 'app-event-comments',
  templateUrl: './event-comments.page.html',
  styleUrls: ['./event-comments.page.scss'],
})
export class EventCommentsPage implements OnInit {
  currentEvent: CurrentEvent = {
    title: 'Present a plan',
    location: 'Meeting room level 9',
    duration: '09:00 - 10:00 AM',
    attendees: 24,
    status: 'live',
  };

  currentUser: any;
  newComment = '';
  comments: Comment[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.getUser() || {
      name: 'Admin User',
      avatar: 'https://i.pravatar.cc/150?img=1',
    };

    this.loadComments();
  }

  loadComments() {
    // Datos de ejemplo
    this.comments = [
      {
        id: '1',
        userName: 'Sarah Johnson',
        avatar: 'https://i.pravatar.cc/150?img=5',
        text: 'Great presentation! The quarterly results look very promising. Looking forward to the Q&A session.',
        time: '2 min ago',
        likes: 12,
        liked: false,
        replies: [
          {
            userName: 'Mike Chen',
            avatar: 'https://i.pravatar.cc/150?img=12',
            text: 'I agree! The growth metrics are impressive.',
            time: '1 min ago',
          },
        ],
      },
      {
        id: '2',
        userName: 'David Martinez',
        avatar: 'https://i.pravatar.cc/150?img=8',
        text: 'Can we get a copy of the slides after the meeting?',
        time: '5 min ago',
        likes: 8,
        liked: true,
        replies: [],
      },
      {
        id: '3',
        userName: 'Emily Watson',
        avatar: 'https://i.pravatar.cc/150?img=9',
        text: 'The new strategy for Q2 sounds exciting! When will we start implementation?',
        time: '8 min ago',
        likes: 15,
        liked: false,
        replies: [
          {
            userName: 'John Smith',
            avatar: 'https://i.pravatar.cc/150?img=11',
            text: 'Implementation starts next week according to the timeline.',
            time: '6 min ago',
          },
          {
            userName: 'Lisa Brown',
            avatar: 'https://i.pravatar.cc/150?img=10',
            text: 'Excited to be part of this!',
            time: '5 min ago',
          },
        ],
      },
      {
        id: '4',
        userName: 'Robert Taylor',
        avatar: 'https://i.pravatar.cc/150?img=13',
        text: 'Could you elaborate more on the budget allocation for the marketing campaign?',
        time: '12 min ago',
        likes: 6,
        liked: false,
        replies: [],
      },
      {
        id: '5',
        userName: 'Jennifer Lee',
        avatar: 'https://i.pravatar.cc/150?img=14',
        text: 'Excellent work team! This is exactly what we needed to move forward.',
        time: '15 min ago',
        likes: 20,
        liked: true,
        replies: [],
      },
    ];
  }

  sendComment() {
    if (!this.newComment || this.newComment.trim() === '') {
      return;
    }

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      userName: this.currentUser.name || 'Admin User',
      avatar: this.currentUser.avatar || 'https://i.pravatar.cc/150?img=1',
      text: this.newComment.trim(),
      time: 'Just now',
      likes: 0,
      liked: false,
      replies: [],
    };

    // Agregar al inicio de la lista
    this.comments.unshift(newCommentObj);

    // Limpiar input
    this.newComment = '';
  }

  toggleLike(comment: Comment) {
    comment.liked = !comment.liked;
    comment.likes += comment.liked ? 1 : -1;
  }

  replyToComment(comment: Comment) {
    console.log('Reply to:', comment.userName);
  }

  sortComments() {
    this.comments.sort((a: Comment, b: Comment) => b.likes - a.likes);
  }
}
