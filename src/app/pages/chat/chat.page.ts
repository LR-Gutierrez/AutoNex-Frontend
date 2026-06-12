import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  data: any;
  messageForm!: FormGroup;
  currentUser = 'johnatan';
  messages = [
    {
      message: 'Hi, johnatan. How you doing?',
      user: 'Jane Smith',
      time: '2020-07-10T13:25:00.000Z',
    },
    {
      message: 'Hope your fine 👍😀',
      user: 'Jane Smith',
      time: '2020-07-10T13:25:00.000Z',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.data = this.router.getCurrentNavigation()!.extras.state!['user'];
      }
    });
  }

  ngOnInit() {
    this.messageForm = this.fb.group({
      message: [null],
    });
  }

  submitMessage() {
    this.messageForm.reset();
  }
}
