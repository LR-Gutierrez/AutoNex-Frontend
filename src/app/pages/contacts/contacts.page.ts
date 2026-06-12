import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  standalone: false,
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactPage implements OnInit {
  users: any;

  constructor(
    private router: Router,
    private dataService: DataService,
  ) {}

  ngOnInit() {
    this.users = this.dataService.getUsers();
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
