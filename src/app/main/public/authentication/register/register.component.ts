import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ModelFormBuilder, ModelFormGroup } from '@gpx/forms/model-form';
import { AuthService } from '@gpx/services/auth.service';
import { Title } from '@angular/platform-browser';
import { AuthUser } from '@gpx/models/auth-user.model';
import { CustomValidators } from '@gpx/forms/custom.validator';
import { UserService } from '@gpx/services/api/user.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'gpx-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm: ModelFormGroup<AuthUser>;
  nextUrl: string;
  showPassword = false;
  isDarkTheme: boolean;
  // UI
  completeView: boolean;
  private readonly onDestroy = new Subject<void>();

  constructor(private router: Router,
              public authService: AuthService,
              private userService: UserService,
              private route: ActivatedRoute,
              private modelFormBuilder: ModelFormBuilder,
              private titleService: Title) {
    this.titleService.setTitle('Registreren | GPX');

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.onDestroy)
    ).subscribe((eventEnd: NavigationEnd) => {
      if (eventEnd.url.includes('/register/complete')) {
        this.completeView = true;
      } else {
        this.completeView = false;
      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.nextUrl = params.next || '/login';
    });

    this.authService.user.then(user => {
      if (user) {
        this.redirectAfterLogin();
      }
    });

    this.registerForm = this.modelFormBuilder.modelGroup(AuthUser, null, {
      username: ['', [Validators.required]],
      email: ['', [Validators.email]],
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required, CustomValidators.equalsField('password')]]
    });

    this.registerForm.get('password').valueChanges.subscribe(() => {
      this.registerForm.get('confirm_password').updateValueAndValidity();
    });

  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();

  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const new_user = this.registerForm.getModel();
      this.registerForm.disable();
      this.userService.createUser(new_user).subscribe(
        user => {
          console.log(user);
          this.redirectAfterRegister();
        },
        e => {
          this.registerForm.enable();
          if (e.error && e.status === 400) {
            this.registerForm.applyRemoteErrors(e.error);
          }
        }
      );
    } else {
      this.registerForm.runValidation();
    }
  }

  redirectAfterRegister() {
    this.router.navigate(['complete'], {relativeTo: this.route});
  }

  redirectAfterLogin() {
    this.router.navigateByUrl(this.nextUrl);
  }
}
