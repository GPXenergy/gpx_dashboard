import { BaseModel } from './base';

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
  password: string;

  /// User settings and personal information
  email: string;
  first_name: string;
  last_name: string;
  api_key: string;

  /// Calculated field
  display_name: string;

  cleanFields(): void {
    super.cleanFields();
    if (this.first_name && this.last_name) {
      this.display_name = this.first_name + ' ' + this.last_name;
    } else {
      this.display_name = this.username;
    }
  }

}
