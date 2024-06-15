import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class LogInGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService) { }

    canActivate(): boolean {

        if (this.authService.getAccessToken() == null) {
            return true;
        }
        else {
            this.router.navigate(['/home']);
            return false;
        }
    }
}