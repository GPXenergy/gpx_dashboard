import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ModelFormBuilder, ModelFormGroup } from '@gpx/forms/model-form';
import { User } from '@gpx/models/user.model';
import { SnackBarService } from '@gpx/services/snack-bar.service';
import { ResetPasswordActionService } from '@gpx/services/api/email-action.service';


@Component({
  selector: 'gpx-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: ModelFormGroup<User>;
  submitSuccess: boolean;

  constructor(private formBuilder: ModelFormBuilder,
              private snackBar: SnackBarService,
              private hashService: ResetPasswordActionService) {
  }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.modelGroup(User, null, {
      username: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    this.forgotPasswordForm.disable();
    this.hashService.requestPasswordReset(this.forgotPasswordForm.getModel()).subscribe({

      next: res => {
        // success
        this.snackBar.success({
          title: `Een email is verzonden met de link om je wachtwoord opnieuw in te stellen`,
        });
        this.submitSuccess = true;
      },
      error: errorResponse => {
        this.forgotPasswordForm.enable();
        if (errorResponse.error && errorResponse.status === 400) {
          this.forgotPasswordForm.applyRemoteErrors(errorResponse.error);
        }
      }
    });
  }
}
