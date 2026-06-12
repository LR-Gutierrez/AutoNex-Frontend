import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {
  data = [
    {
      image: 'assets/images/media.svg',
      title: 'Connect and engage with your audience',
      description: 'Share with your audience and engage to boost your profile',
    },
    {
      image: 'assets/images/dating.svg',
      title: 'Stay in touch with your love ones',
      description: 'Chat, post and grow with your family around',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  navigate() {
    this.router.navigate(['/welcome']);
  }
}
