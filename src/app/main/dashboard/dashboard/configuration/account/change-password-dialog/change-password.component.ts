import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { SnackBarService } from '@gpx/services/snack-bar.service';
import { AuthService } from '@gpx/services/auth.service';
import { ModelFormBuilder, ModelFormGroup } from '@gpx/forms/model-form';
import { AuthUser } from '@gpx/models/auth-user.model';
import { User } from '@gpx/models/user.model';
import { UserService } from '@gpx/services/api/user.service';
import { CustomValidators } from '@gpx/forms/custom.validator';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'gpx-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {


  changePasswordForm: ModelFormGroup<AuthUser>;
  user: User;

  formIsValid: boolean;

  // UI
  show_password_old: boolean;
  show_password: boolean;
  labelType: 'above';

  constructor(public dialogRef: MatDialogRef<ChangePasswordComponent>,
              private modelFormBuilder: ModelFormBuilder,
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

  initForm(): void {
    this.changePasswordForm = this.modelFormBuilder.modelGroup(AuthUser, null, {
      password: ['', Validators.required],
      new_password: ['', Validators.required],
      confirm_password: ['', [Validators.required, CustomValidators.equalsField('new_password')]]
    });
  }


  onSubmit(): void {
    // Submit if valid
    if (this.changePasswordForm.valid) {
      const passwordModel = this.changePasswordForm.getModel();
      this.userService.updateUser(this.user.pk, passwordModel).subscribe(
        success => {
          this.dialogRef.close(true);
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

  onNoClick(): void {
    this.dialogRef.close(false);
  }


}

