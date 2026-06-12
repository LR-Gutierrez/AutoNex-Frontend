import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-post-detail',
  templateUrl: './post-detail.page.html',
  styleUrls: ['./post-detail.page.scss'],
})
export class PostDetailPage implements OnInit {
  commentForm!: FormGroup;

  post = {
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=124&q=80',
    name: 'Christine Jones',
    date: '2020-07-10T13:25:00.000Z',
    images: [
      'https://images.unsplash.com/photo-1470219556762-1771e7f9427d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1538384823779-80c3e445d1a4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
    ],
    likes: 2310,
    comments: {
      total: 450,
      latest_comments: [
        {
          id: 1,
          user: 'harry_400',
          comment: 'Amazings pics, ❤️',
        },
        {
          id: 2,
          user: 'thetraveleruser',
          comment: 'Amazings pics where are your right now?? Cheers, 😍',
        },
        {
          id: 3,
          user: 'marcy_williams210',
          comment: `❤️❤️❤️, Miss you Christine, hope you'll be back soon. 🤩❤️‍🔥🙌`,
        },
      ],
    },
    views: 90,
  };

  imgConfig = {
    spaceBetween: 6,
    slidesPerView: 1,
    centeredSlides: true,
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit() {
    this.commentForm = this.fb.group({
      comment: [null],
    });
  }

  submitComment() {}

  navigateToComments() {
    this.router.navigate(['/comments']);
  }
}
