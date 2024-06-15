import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {

  searchInput!: string;

  constructor(private router: Router, private authService: AuthService, private userService: UserService) { }

  onEnter(event: Event): void {

    const keyboardEvent = event as KeyboardEvent;

    if (keyboardEvent.key === 'Enter') {
      this.router.navigate(['/search-results', this.searchInput]);
    }
  }
}
