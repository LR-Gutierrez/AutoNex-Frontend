import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  standalone: false,
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {
  isActive = false;
  comments: any;
  commentForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
  ) {}

  ngOnInit() {
    this.commentForm = this.fb.group({
      comment: [null],
    });

    this.comments = this.dataService.getComments();
  }

  submitComment() {
    this.commentForm.reset();
  }
}
