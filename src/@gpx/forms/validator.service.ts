import { FormArray, FormGroup, ValidationErrors } from '@angular/forms';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormErrors } from './form-error.model';
import { TranslationLoaderService } from '@gpx/services/translation-loader.service';

export const errorMessageKeys: { [key: string]: string } = {
  required: 'Dit veld is verplicht',
  email: 'Geen correcte email ingevuld',
  max: 'Max bereikt',
  min: 'Minimale nog niet bereikt',
  maxlength: 'Maximale lengte bereikt',
  minlength: 'Minimale lengte nog niet bereikt',
  pattern: 'FORM_ERROR_MESSAGE.PATTERN',
  maxarraylength: 'FORM_ERROR_MESSAGE.MAX_ARRAY_LENGTH',
  minarraylength: 'FORM_ERROR_MESSAGE.MIN_ARRAY_LENGTH',
  maxgrouptotalvalue: 'FORM_ERROR_MESSAGE.MAX_GROUP_TOTAL_VALUE',
  mingrouptotalvalue: 'FORM_ERROR_MESSAGE.MIN_GROUP_TOTAL_VALUE',
  dateinpast: 'De opgegeven datum is een datum in het verleden',
  time: 'Ongeldige tijd',
  matDatepickerParse: 'Ongeldige datum',
  invalidchars: 'Ongeldige characters',
  phonenumber: 'Ongeldige telefoonnummer',
  fieldsnotequal: 'Bovenstaande velden zijn niet gelijk',
  password: 'Vereist minimaal 1 hoofdletter en 1 cijfer'
};

@Injectable({
  providedIn: 'root'
})
export class FormValidatorService {
  private backendErrorName = 'backend';

  public constructor(private translator: TranslateService, translationLoader: TranslationLoaderService) {
  }

  /**
   * validate form, fill formErrors with messages where fields are invalid.
   * @param {FormGroup | FormArray} formToValidate: for mto validate
   * @param {FormErrors} formErrors: Obj to put the error messages in
   */
  public validateForm(formToValidate: FormGroup | FormArray, formErrors: FormErrors) {
    const formControls = formToValidate.controls;

    if (!formToValidate.errors && formErrors.errorMessage) {
      formErrors.errorMessage = '';
    }

    for (const field in formControls) {
      if (!(formControls.hasOwnProperty(field))) {
        continue;
      }
      const control = formToValidate.get(field);
      if (!(formErrors.hasOwnProperty(field))) {
        // Missing error field for this control..
        formErrors.addControl(field, control);
      }

      if (control.invalid && (control instanceof FormArray || (control.updateOn === 'blur' || control.touched) || control.dirty)) {
        this.translatedErrorMessage(control.errors).then(
          message => {
            formErrors[field].errorMessage = message;
          },
          rejected => {
            // No translation
          }
        );
      } else {
        formErrors[field].errorMessage = ''; // Clear current error message
      }

      if (control instanceof FormGroup) {
        // Validate sub groups
        this.validateForm(control, formErrors.getSubErrors(field));
      }

      if (control instanceof FormArray) {
        // Validate sub groups
        const subFormErrors = formErrors.getSubErrorsArray(field);
        const subFormControls = control.controls;

        while (subFormControls.length > subFormErrors.length) {
          subFormErrors.push(new FormErrors(subFormControls[0] as FormGroup | FormArray));
        }
        while (subFormControls.length < subFormErrors.length) {
          subFormErrors.pop();
        }

        subFormControls.forEach((subControl: FormArray | FormGroup, index: number) => {
          this.validateForm(subControl, subFormErrors[index]);
        });
      }
    }
  }

  /**
   * createRelation errors returned by API call
   * @param {FormGroup | FormArray} form: form
   * @param {FormErrors} formErrors: Obj to put the error messages in
   * @param remoteErrors: error object from response.
   */
  public applyRemoteErrors(form: FormGroup, formErrors: FormErrors, remoteErrors: IRemoteErrors) {
    for (const field in remoteErrors) {
      if (!(remoteErrors.hasOwnProperty(field))) {
        continue;
      }
      const errorValue = remoteErrors[field];
      let errorMessage: string = null;

      if (typeof errorValue === 'string') {
        errorMessage = errorValue;
      } else if (errorValue instanceof Array && typeof errorValue[0] === 'string') {
        // error message for this field
        errorMessage = errorValue[0] as string;
      }
      if (errorMessage && field === 'non_field_errors') {
        form.setErrors({backend: true});
        formErrors.errorMessage = errorMessage;
      } else if (errorMessage) {
        // error message for this field
        form.get(field).setErrors({backend: true});
        formErrors[field].errorMessage = errorMessage;
      } else if (errorValue instanceof Array) {
        // errors for sub controls
        const subFormControls = form.get(field) as FormArray;
        const subFormErrors = formErrors?.getSubErrorsArray(field);
        subFormControls.controls.forEach((subControl: FormGroup, index: number) => {
          this.applyRemoteErrors(subControl, subFormErrors[index], remoteErrors[field] as IRemoteErrors);
        });
      } else if (errorValue instanceof Object) {
        // errors for sub controls
        const subFormControl = form.get(field) as FormGroup;
        const subFormErrors = formErrors?.getSubErrors(field);
        if (subFormControl && subFormErrors) {
          this.applyRemoteErrors(subFormControl, subFormErrors, remoteErrors[field] as IRemoteErrors);
        }
      }
    }
  }

  /**
   * get translated error message
   * @param {ValidationErrors} error: error object
   * @return {Promise<string>}: error message (translated) as promise
   */
  private translatedErrorMessage(error: ValidationErrors): Promise<string> {
    if (error) {
      for (const key in error) {
        if (error.hasOwnProperty(key)) {
          const errorMsg = errorMessageKeys[key];
          if (!errorMsg) {
            return new Promise<string>((resolve, reject) => {
              reject('');
            });
          }
          return this.translator.get(errorMsg, error[key]).toPromise();
        }
      }
    }
    return new Promise<string>((resolve, reject) => {
      resolve('');
    });
  }
}

export interface IRemoteErrors {
  [key: string]: string | string[] | IRemoteErrors | IRemoteErrors[];
}
