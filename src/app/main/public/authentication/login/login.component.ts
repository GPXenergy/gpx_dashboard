import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelFormBuilder, ModelFormGroup } from '@gpx/forms/model-form';
import { LoginUser } from '@gpx/models/user.model';
import { AuthService } from '@gpx/services/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'gpx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: ModelFormGroup<LoginUser>;
  nextUrl: string;
  show_password = false;
  isDarkTheme: boolean;

  constructor(private router: Router,
              public authService: AuthService,
              private route: ActivatedRoute,
              private modelFormBuilder: ModelFormBuilder,
              private titleService: Title) {
    this.titleService.setTitle('Inloggen | GPX');
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.nextUrl = params['next'] || '/personal-meter';
    });

    this.authService.user.then(user => {
      if (user) {
        this.redirectAfterLogin();
      }
    });

    this.loginForm = this.modelFormBuilder.modelGroup(LoginUser, null, {
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [false],
    });
    this.isDarkTheme = document.body.classList.contains('theme-dark');

  }

  ngOnDestroy() {
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.getModel();
      this.authService.login(credentials).subscribe(
        user => {
          console.log(user);
          this.redirectAfterLogin();
        },
        e => {
          if (e.error && e.status === 400) {
            this.loginForm.applyRemoteErrors(e.error);
          }
        }
      );
    } else {
      this.loginForm.runValidation();
    }
  }

  redirectAfterLogin() {
    this.router.navigateByUrl(this.nextUrl);
  }
}
