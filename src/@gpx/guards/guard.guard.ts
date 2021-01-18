import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class GuardKeeper {

  constructor(protected authService: AuthService,
              protected router: Router) {
  }

  public isLoggedIn(): Promise<boolean> {
    return this.authService.user.then(user => {
      return !!user;
    }).catch(e => {
      return false;
    });
  }

  public redirectTo(url: any[], extras?: NavigationExtras) {
    this.router.navigate(url, extras);
  }

  public redirectToLogin(nextUrl: string): void {
    this.redirectTo(['/login'], {queryParams: {next: nextUrl}, replaceUrl: true});
  }
}
