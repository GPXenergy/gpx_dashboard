import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ResetPasswordActionService } from '@gpx/services/api/email-action.service';
import { ModelFormBuilder, ModelFormGroup } from '@gpx/forms/model-form';
import { AuthUser } from '@gpx/models/auth-user.model';
import { CustomValidators } from '@gpx/forms/custom.validator';


@Component({
  selector: 'gpx-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: ModelFormGroup<AuthUser>;
  showPassword: boolean;
  submitSuccess: boolean;
  hash: string;

  loading = true;
  hashValid: boolean;

  constructor(private formBuilder: ModelFormBuilder,
              private resetPasswordActionService: ResetPasswordActionService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.hash = params.h || '';
      this.validateHash();
    });

    this.resetPasswordForm = this.formBuilder.modelGroup(AuthUser, null, {
      password: ['', Validators.required],
      confirm_password: ['', [Validators.required, CustomValidators.equalsField('password')]]
    });

    this.resetPasswordForm.get('password').valueChanges.subscribe(() => {
      this.resetPasswordForm.get('confirm_password').updateValueAndValidity();
    });
  }

  validateHash(): void {
    this.resetPasswordActionService.validateHash(this.hash).subscribe({
      next: res => {
        // success
        this.hashValid = true;
        this.loading = false;
      },
      error: errorResponse => {
        this.hashValid = true;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    const formValue = this.resetPasswordForm.getModel();
    this.resetPasswordActionService.resetPassword(formValue, this.hash).subscribe({
      next: (res) => {
        // success
        this.submitSuccess = true;
      },
      error: (e) => {
        if (e.error && e.status === 400) {
          this.resetPasswordForm.applyRemoteErrors(e.error);
        }
      },
    });
  }
}
