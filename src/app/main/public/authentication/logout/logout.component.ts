import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@gpx/services/auth.service';

@Component({
  template: '',
})
export class LogoutComponent implements OnInit {
  constructor(private router: Router,
              public authService: AuthService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.authService.logout();
    this.route.queryParams.subscribe(params => {
      const nextUrl = params['next'] || '/login';
      this.router.navigateByUrl(nextUrl, {replaceUrl: true});
    });

  }

}
