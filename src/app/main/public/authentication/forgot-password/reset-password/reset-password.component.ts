import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@oanax/animations';
import { HashService } from '@oanax/services/api/hash.service';


@Component({
  selector: 'fuse-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  animations: fuseAnimations
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  resetPasswordFormErrors: any;
  submitSuccess: boolean;
  hashValid: boolean;
  hash: string;

  loading = true;

  constructor(private formBuilder: FormBuilder,
              private hashService: HashService,
              private route: ActivatedRoute) {
    this.submitSuccess = false;
    this.hashValid = true;
    this.resetPasswordFormErrors = {
      password: {},
      passwordConfirm: {}
    };
  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        this.hash = params['h'] || '';
        this.validateHash();
      }
    );

    this.resetPasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      passwordConfirm: ['', [Validators.required, confirmPassword]]
    });

    this.resetPasswordForm.valueChanges.subscribe(() => {
      this.onForgotPasswordFormValuesChanged();
    });
  }

  onForgotPasswordFormValuesChanged() {
    for (const field in this.resetPasswordFormErrors) {
      if (!this.resetPasswordFormErrors.hasOwnProperty(field)) {
        continue;
      }

      // Clear previous errors
      this.resetPasswordFormErrors[field] = {};

      // Get the control
      const control = this.resetPasswordForm.get(field);

      if (control && control.dirty && !control.valid) {
        this.resetPasswordFormErrors[field] = control.errors;
      }
    }
  }

  validateHash() {
    this.loading = true;
    this.hashService.resetPassword({'hash': this.hash}).subscribe(
      res => {
        // success
        this.hashValid = true;
        this.loading = false;
      },
      errorResponse => {
        // fails, check errorResponse.error for {errorField: errorMessage}
        console.log(errorResponse);
        this.hashValid = false;
        this.loading = false;
      }
    );
  }

  onSubmit() {
    this.loading = true;

    const formValue = this.resetPasswordForm.getRawValue();
    formValue['hash'] = this.hash;
    this.hashService.resetPassword(formValue).subscribe(
      res => {
        // success
        this.submitSuccess = true;
        this.loading = false;

      },
      errorResponse => {
        // fails, check errorResponse.error for {errorField: errorMessage}
        console.log(errorResponse);
        this.loading = false;

      }
    );
  }
}


function confirmPassword(control: AbstractControl) {
  if (!control.parent || !control) {
    return;
  }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('passwordConfirm');

  if (!password || !passwordConfirm) {
    return;
  }

  if (passwordConfirm.value === '') {
    return;
  }

  if (password.value !== passwordConfirm.value) {
    return {
      passwordsNotMatch: true
    };
  }
}
