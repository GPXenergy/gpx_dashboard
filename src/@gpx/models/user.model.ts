import { BaseModel, propertyValidators, Validators } from './base';
import { CustomValidators } from '../forms/custom.validator';

/**
 * Login model with username/password
 */
export class LoginUser extends BaseModel {
  username: string;
  password: string;
  remember: boolean;  // To remember login
}

/**
 * User model
 */
export class User extends BaseModel {
  /// Required user properties
  username: string;

  /// User settings and personal information
  email: string;
  verified_email: string;
  first_name: string;
  last_name: string;

  getValidators(): propertyValidators<User> {
    const validators: propertyValidators<User> = {
      username: [CustomValidators.simpleText, Validators.maxLength(80)],
      first_name: [CustomValidators.simpleText, Validators.maxLength(30)],
      last_name: [CustomValidators.simpleText, Validators.maxLength(150)],
      email: [Validators.email, Validators.maxLength(254)],
    };
    return Object.assign(validators, super.getValidators());
  }
}
