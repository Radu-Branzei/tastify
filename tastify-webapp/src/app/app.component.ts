import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  title = 'tastify-webapp';

  dataNeeded: any;

  constructor(private router: Router, private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('spotifyAccessToken') != null;
  }

  redirectToHomePage(): void {
    this.router.navigate(['/home']);
  }

  logOut(): void {
    this.authService.logOut();
  }

  redirectToMyProfilePage(): void {
    this.router.navigate(['/profile/me']);
  }

  getUserProfileImage(): string {
    let userData = this.authService.getLoggedInUserData();
    if (userData != null) {
      return userData.images[0].url;
    }

    return "../assets/images/tastify-logo.png";
  }
}
