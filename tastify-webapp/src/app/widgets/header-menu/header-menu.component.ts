import { Component, OnInit } from '@angular/core';
import { SearchBarComponent } from "../search-bar/search-bar.component";
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-menu',
  standalone: true,
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.scss',
  imports: [CommonModule, SearchBarComponent]
})
export class HeaderMenuComponent {

  userData: any;

  constructor(private router: Router, private authService: AuthService, private userService: UserService) { }

  getUserProfileImage(): string {
    let userData = this.authService.getLoggedInUserData();
    if (userData != null) {
      return userData.images[0].url;
    }

    return "../assets/images/tastify_logo.png";
  }
  isLoggedIn(): boolean {
    return this.authService.getAccessToken() != null;
  }

  redirectToHomePage(): void {
    this.router.navigate(['/home']);
  }

  redirectToMyProfilePage(): void {
    this.router.navigate(['/profile/me']);
  }

  logOut(): void {
    this.authService.logOut();
  }
}
