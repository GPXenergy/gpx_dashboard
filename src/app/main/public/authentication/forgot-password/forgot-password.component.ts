import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@oanax/animations';
import { HashService } from '@oanax/services/api/hash.service';


@Component({
  selector: 'fuse-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: fuseAnimations
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  forgotPasswordFormErrors: any;
  submitSuccess: boolean;

  isDarkTheme: boolean;


  constructor(private formBuilder: FormBuilder,
              private hashService: HashService) {
    this.submitSuccess = false;
    this.forgotPasswordFormErrors = {
      email: {}
    };
  }

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.forgotPasswordForm.valueChanges.subscribe(() => {
      this.onForgotPasswordFormValuesChanged();
    });
    this.isDarkTheme = document.body.classList.contains('theme-dark');
  }

  onForgotPasswordFormValuesChanged() {
    for (const field in this.forgotPasswordFormErrors) {
      if (!this.forgotPasswordFormErrors.hasOwnProperty(field)) {
        continue;
      }

      // Clear previous errors
      this.forgotPasswordFormErrors[field] = {};

      // Get the control
      const control = this.forgotPasswordForm.get(field);

      if (control && control.dirty && !control.valid) {
        this.forgotPasswordFormErrors[field] = control.errors;
      }
    }
  }

  onSubmit() {
    const formValue = this.forgotPasswordForm.getRawValue();
    this.hashService.forgotPassword(formValue).subscribe(
      res => {
        // success
        this.submitSuccess = true;
      },
      errorResponse => {
        // fails, check errorResponse.error for {errorField: errorMessage}
        console.log(errorResponse);
      }
    );
  }
}
