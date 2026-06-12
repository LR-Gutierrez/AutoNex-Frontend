import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  standalone: false,
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
  messages: any;

  constructor(
    private router: Router,
    private dataService: DataService,
  ) {}

  ngOnInit() {
    this.messages = this.dataService.getMessages();
  }

  navigateToContacts() {
    this.router.navigate(['contacts']);
  }

  navigateToChat(item: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        user: item,
      },
    };
    this.router.navigate(['chat'], navigationExtras);
  }
}
