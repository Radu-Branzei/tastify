import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in-page',
  standalone: true,
  imports: [],
  templateUrl: './log-in-page.component.html',
  styleUrl: './log-in-page.component.scss'
})
export class LogInPageComponent {

  constructor(private router: Router, private authService: AuthService) { }

  logInWithSpotify(): void {
    this.authService.redirectToAuthorization();
  }
}
