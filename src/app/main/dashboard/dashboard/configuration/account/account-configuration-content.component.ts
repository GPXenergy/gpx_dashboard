import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { ModelFormBuilder, ModelFormGroup } from '@gpx/forms/model-form';
import { FormValidatorService } from '@gpx/forms/validator.service';
import { User } from '@gpx/models/user.model';
import { Validators } from '@angular/forms';
import { AuthService } from '@gpx/services/auth.service';
import { SnackBarService } from '@gpx/services/snack-bar.service';
import { UserService } from '@gpx/services/api/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'account-config-content',
  templateUrl: './account-configuration-content.component.html',
  styleUrls: ['./account-configuration-content.component.scss'],
})
export class AccountConfigurationContentComponent implements OnInit, OnDestroy {
  user: User;
  userForm: ModelFormGroup<User>;
  private readonly _unsubscribeAll = new Subject<void>();

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private _snackBar: SnackBarService,
              private router: Router,
              private authService: AuthService,
              private userService: UserService,
              private formBuilder: ModelFormBuilder,
              private formValidator: FormValidatorService,
              private titleService: Title) {
    this.titleService.setTitle('Account Instellingen | GPX');
  }

  ngOnInit(): void {
    this.authService.user.then(user => {
      this.user = user;
      this.initForm(user);
    });
  }

  initForm(user: User): void {
    this.userForm = this.formBuilder.modelGroup(User, user, {
      first_name: [''],
      last_name: [''],
      email: ['', [Validators.maxLength(254), Validators.email, Validators.required]],
    });
  }

  cancelChanges(): void {
    // to reset and mark as untouched and not dirty
    this.initForm(this.user);
  }

  onSubmitForm(): void {
    if (this.userForm.valid) {
      this.userService.updateUser(this.user.pk, this.userForm.getModel()).subscribe(response => {
        this.authService.patchUser(response);
        this.initForm(this.user);
        this._snackBar.success({
          title: 'Account is aangepast.',
        });
      }, e => {
        if (e.error && e.status === 400) {
          this.userForm.applyRemoteErrors(e.error);
        }
      });
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  deleteAccount(event): void {
    if (confirm(`Weet je zeker dat je jouw account wil verwijderen? Dit verwijderd ook al jouw metergegevens en data.`)) {
      this.userService.deleteUser(this.user.pk).subscribe(
        result => {
          this._snackBar.success({
            title: `Jouw account is verwijderd!`,
          });
          this.router.navigate(['/login']).then(() => {
            this.authService.logout();
          });
        }
      );
    }
  }

}
