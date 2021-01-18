import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

class ErrorField {
  errorMessage: string; // error message
  constructor() {
    this.errorMessage = '';
  }

  // noinspection TsLint
  [key: string]: any;
}

export class FormErrors extends ErrorField {
  public constructor(form: FormGroup | FormArray) {
    super();
    const formControls = form.controls;
    for (const key in formControls) {
      if (!formControls.hasOwnProperty(key)) {
        continue;
      }
      this.addControl(key, form.get(key));
    }
  }

  public addControl(field: string, control: AbstractControl) {
    if (control instanceof FormGroup) {
      this[field] = new FormErrors(control);
    } else if (control instanceof FormArray) {
      this[field] = new FormErrorsArray(control);
    } else {
      this[field] = new ErrorField();
    }
  }

  public getSubErrors(field: string): FormErrors {
    return this[field] as FormErrors;
  }

  public getSubErrorsArray(field: string): FormErrors[] {
    return (this[field] as FormErrorsArray).list;
  }

}

class FormErrorsArray extends ErrorField {
  list: FormErrors[];

  constructor(control: FormArray) {
    super();
    this.list = control.controls.map((arrayControl: FormGroup) =>
      new FormErrors(arrayControl)
    );
  }
}
