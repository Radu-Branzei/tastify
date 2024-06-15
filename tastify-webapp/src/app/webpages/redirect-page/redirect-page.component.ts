import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-redirect-page',
  templateUrl: './redirect-page.component.html',
  styleUrl: './redirect-page.component.scss'
})
export class RedirectPageComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService, private userService: UserService) { }

  async ngOnInit(): Promise<void> {
    this.authService.handleAuthorizationCallback();
    await this.userService.getUsersProfileInfo();
    this.router.navigate(['/home']);
  }
}
