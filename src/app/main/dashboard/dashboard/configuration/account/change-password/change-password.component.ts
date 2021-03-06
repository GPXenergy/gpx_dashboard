import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { SnackBarService } from '@gpx/services/snack-bar.service';
import { AuthService } from '@gpx/services/auth.service';
import { ModelFormBuilder, ModelFormGroup } from '@gpx/forms/model-form';
import { AuthUser } from '@gpx/models/auth-user.model';
import { User } from '@gpx/models/user.model';
import { UserService } from '@gpx/services/api/user.service';
import { CustomValidators } from '@gpx/forms/custom.validator';


@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {


  private readonly onDestroy: Subject<void> = new Subject();

  changePasswordForm: ModelFormGroup<AuthUser>;
  user: User;

  formIsValid: boolean;

  // UI
  show_password_old: boolean;
  show_password: boolean;
  labelType: 'above';

  constructor(private modelFormBuilder: ModelFormBuilder,
              private authService: AuthService,
              private _snackBar: SnackBarService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.authService.user.then(user => {
      this.user = user;
    });
    this.initForm();
  }

  initForm() {
    this.changePasswordForm = this.modelFormBuilder.modelGroup(AuthUser, null, {
      password: ['', Validators.required],
      new_password: ['', Validators.required],
      confirm_password: ['', [Validators.required, CustomValidators.equalsField('new_password')]]
    });

    // this.changePasswordForm.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe(() => {
    // });

  }


  onSubmit() {
    // Submit if valid
    if (this.changePasswordForm.valid) {
      const passwordModel = this.changePasswordForm.getModel();
      this.userService.updateUserPassword(passwordModel, this.user.pk).subscribe(
        success => {
          this.openSnackBar('Wachtwoord is aangepast!');
          this.changePasswordForm = null;
          this.formIsValid = false;
          setTimeout(() => this.initForm(), 200);

        },
        e => {
          if (e.error && e.status === 400) {
            this.changePasswordForm.applyRemoteErrors(e.error);
          }
        });
    } else {
      this.changePasswordForm.runValidation();
    }
  }


  openSnackBar(message: string) {
    this._snackBar.success({
      title: message,
    });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

}

