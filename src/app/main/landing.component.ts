import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@gpx/services/auth.service';

/**
 * Landing redirects the visitor to the right page page when landing
 * - logged in -> to dashboard
 * - not logged in -> to login
 */
@Component({
  template: '',
})
export class LandingComponent {

  constructor(private authService: AuthService, private router: Router) {
    this.authService.user.then(
      user => this.router.navigate([user ? '/dashboard' : '/login'], {replaceUrl: true})
    );
  }

}
