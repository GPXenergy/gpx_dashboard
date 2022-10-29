import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { pkType, Validators } from '../models/base';


export class CustomValidators {
  // Validators

  /**
   * Get validator function that checks the value is some simple text (like name, title)
   */
  public static get simpleText(): ValidatorFn {
    const invalidCharacters = new RegExp('[^0-9a-zA-ZàáâäãåąčćçęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñšžÀÁÂÄÃÅĄĆČÇĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßŒÆŠŽ∂ð ,.\'-]', 'g');
    return CustomValidators.invalidCharacters(invalidCharacters);
  }

  /**
   * Get validator function that checks if the value equals the value of the closest form field with given name
   * @param {string} fieldName : field name (from root perspective)
   */
  public static equalsField(fieldName: string): ValidatorFn {
    return (c: AbstractControl): ValidationErrors => {
      const other = c.root.get(fieldName);
      return other && c.value !== other.value ? {fieldsnotequal: {valid: false}} : null;
    };
  }

  /**
   * Get validator function that checks if the value is part of given enum
   * @param {((value: any) => boolean))} predicate : check the predicate, only then the
   */
  public static requiredIf(predicate: ((value: any) => boolean)): ValidatorFn {
    return (c: AbstractControl): ValidationErrors => {
      return predicate(c.value) ? Validators.required(c) : null;
    };
  }

  public static invalidCharacters(invalidCharactersPattern: RegExp): ValidatorFn {
    const getInvalidChars = (matches: any[]): string => {
      matches = Array.from(new Set<string>(matches));
      return matches.reduce((characterString, character, index) => {
        if (index) {
          characterString += ', ';
        }
        return characterString + character;
      }, '');
    };
    return (c: AbstractControl): ValidationErrors => {
      if (typeof c.value !== 'string') {
        return null;
      }
      const matches = c.value.match(invalidCharactersPattern);
      return matches && matches.length ? {invalidchars: {invalidCharacters: getInvalidChars(matches)}} : null;
    };
  }

  /** requires 1 capital, 1 number and at least 8 chars */
  public static strongPassword(c: AbstractControl): ValidationErrors {
    const hasNumber = /\d/.test(c.value);
    const hasUpper = /[A-Z]/.test(c.value);
    const hasLower = /[a-z]/.test(c.value);
    const valid = hasNumber && hasUpper && hasLower;
    if (c.value && (!valid || c.value.length < 8)) {
      return {password: true};
    }
    return null;
  }
}
