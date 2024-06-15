import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService) { }

    canActivate(): boolean {

        if (this.authService.getAccessToken() != null) {
            if (this.authService.isAccessTokenExpired()) {
                localStorage.clear();
                this.router.navigate(['/login']);
                return false;
            }
            else {
                return true;
            }
        }
        else {
            localStorage.clear();
            this.router.navigate(['/login']);
            return false;
        }
    }
}