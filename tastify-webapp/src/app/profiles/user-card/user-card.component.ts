import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-card',
  standalone: true,
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent {

  @Input() userId!: string;
  @Input() imageUrl!: string;
  @Input() name!: string;

  constructor(private router: Router) { }

  redirectToUserPage() {
    this.router.navigate(['/profile', this.userId]);
  }
}
