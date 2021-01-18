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
   * Get validator function that checks if value is a phone number
   */
  public static get phoneNumber(): ValidatorFn {
    const validatorFn = Validators.pattern(new RegExp('^\\+?[0-9\\s]{7,15}$'));
    return (c: AbstractControl): ValidationErrors => {
      return validatorFn(c) ? {'phonenumber': true} : null;
    };
  }

  /**
   * Get validator function that checks if the value is part of given enum
   * @param keys : keys (SomeType.keys)
   * @param acceptNull : accept null value, default false
   */
  public static inEnum<E>(keys: /*typeof */E, acceptNull = false): ValidatorFn {
    return (c: AbstractControl): ValidationErrors => {
      if (acceptNull && c.value === null) {
        return null;
      }
      return !keys.hasOwnProperty(c.value) ? {'invalidtype': true} : null;
    };
  }

  /**
   * Get validator function that checks if the value equals the value of the closest form field with given name
   * @param {string} fieldName : field name (from root perspective)
   */
  public static equalsField(fieldName: string): ValidatorFn {
    return (c: AbstractControl): ValidationErrors => {
      const other = c.root.get(fieldName);
      return other && c.value !== other.value ? {'fieldsnotequal': {valid: false}} : null;
    };
  }

  /**
   * Get validator function that checks if the value is in given list
   * @param {pkType[] | ((value: any) => pkType[]))} list : list to check, can be list of function that returns a list
   */
  public static valueInAllowedList(list: pkType[] | ((value: any) => pkType[])): ValidatorFn {
    return (c: AbstractControl): ValidationErrors => {
      if (typeof list === 'function') {
        return c.value in list(c.value) ? null : {'invalidoption': true};
      }
      return c.value in list ? null : {'invalidoption': true};
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
      return matches && matches.length ? {'invalidchars': {'invalidCharacters': getInvalidChars(matches)}} : null;
    };
  }

  /**
   * Get validator function that checks if given date is in the future
   */
  public static dateInFuture(c: AbstractControl): ValidationErrors {
    return c.value && new Date(c.value) < new Date() ? {'dateinpast': true} : null;
  }

  /**
   * Get validator function that checks input is a valid time string or not
   * @param {string} time : input time
   */
  public static validTime(): ValidatorFn {
    const validatorFn = Validators.pattern(new RegExp('^(([01]\\d)|2[0-3]):?([0-5]\\d)$'));
    return (c: AbstractControl): ValidationErrors => {
      return validatorFn(c) ? {'time': true} : null;
    };
  }

  // Group validators
  /**
   * Get validator function that checks if the total value of a group is at least the given amount
   * @param {number} min : min total value
   */
  public static minTotalValue(min: number): ValidatorFn {
    return (c: AbstractControl): ValidationErrors => {
      if (!(c instanceof FormArray || c instanceof FormGroup)) {
        return null;
      }
      let total = 0;
      for (const subC of Object.keys(c.controls)) {
        total += c.get(subC).value;
      }
      return total < min ? {'mingrouptotalvalue': {'min': min, 'actual': total}} : null;
    };
  }

  /**
   * Get validator function that checks if the total value of a group is at most the given amount
   * @param {number} max : max total value
   * @param {number} input : input max value in component, for when form has more controls
   * TODO: replace input with fields / exclude
   */
  public static maxTotalValue(max: number, input?: number): ValidatorFn {
    return (c: AbstractControl): ValidationErrors => {
      if (!(c instanceof FormArray || c instanceof FormGroup)) {
        return null;
      }
      let total = 0;
      if (input) {
        total += input;
        return total > max ? {'maxgrouptotalvalue': {'max': max, 'actual': total}} : null;
      } else {
        for (const subC of Object.keys(c.controls)) {
          total += c.get(subC).value;
        }
        return total > max ? {'maxgrouptotalvalue': {'max': max, 'actual': total}} : null;
      }
    };
  }

  // Array validators
  /**
   * Get validator function that checks if the values in the form array are exceeding max value
   * @param {number} max : max element length
   */
  public static MaxElementLengthInArray(max: number): ValidatorFn {
    return (c: AbstractControl): ValidationErrors => {
      if (!(c instanceof FormArray)) {
        return null;
      }
      const invalid = c.getRawValue().find(val => val.length > max);
      return invalid ? {'maxelementlengthinarray': {'max': max, 'value': invalid}} : null;
    };
  }

  /**
   * Get validator function that checks if the values in the form array are less than min value
   * @param {number} min : min element length
   */
  public static MinElementLengthInArray(min: number): ValidatorFn {
    return (c: AbstractControl): ValidationErrors => {
      if (!(c instanceof FormArray)) {
        return null;
      }
      const invalid = c.getRawValue().find(val => val.length < min);
      return invalid ? {'minelementlengthinarray': {'min': min, 'value': invalid}} : null;
    };
  }

  /**
   * Get validator function that checks input for minimum amount of values in the array
   * @param {number} min : min amount of values in array
   */
  public static minLengthArray(min: number): ValidatorFn {
    return (c: AbstractControl): ValidationErrors => {
      if (!(c instanceof FormArray)) {
        return null;
      }
      return c.value.length < min ? {'minarraylength': {'min': min, 'actual': c.value.length}} : null;
    };
  }

  /**
   * Get validator function that checks input for maximum amount of values in the array
   * @param {number} max : max amount of values in array
   */
  public static maxLengthArray(max: number): ValidatorFn {
    return (c: AbstractControl): ValidationErrors => {
      if (!(c instanceof FormArray)) {
        return null;
      }
      return c.value.length > max ? {'maxarraylength': {'max': max, 'actual': c.value.length}} : null;
    };
  }

  /**
   * Get validator function that checks input for maximum amount of values in the array
   * @param {number} max : max amount of values in array
   */
  public static maxLengthSimpleArray(max: number): ValidatorFn {
    return (c: AbstractControl): ValidationErrors => {
      return c?.value?.length > max ? {'maxarraylength': {'max': max, 'actual': c.value.length}} : null;
    };
  }
}
