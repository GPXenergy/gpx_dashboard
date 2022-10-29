import { BaseModel, modelPropertiesObj, modelRelation, propertyValidators, Validators } from './base';
import { User } from './user.model';
import { Meter } from './meter.model';
import { CustomValidators } from '@gpx/forms/custom.validator';


/**
 * AuthUser model
 */
export class AuthUser extends User {
  api_key: string;
  default_meter: modelRelation<Meter>;

  password: string;
  new_password: string;
  confirm_password: string;

  public getDefaultMeter(): Meter {
    return BaseModel.getModelProperty(Meter, this.default_meter);
  }

  protected createModelRelations(values: modelPropertiesObj<this>): void {
    super.createModelRelations(values);
    this.createRelation(User, values, 'default_meter');
  }

  getValidators(): propertyValidators<AuthUser> {
    const validators: propertyValidators<AuthUser> = {
      password: [CustomValidators.strongPassword],
      new_password: [CustomValidators.strongPassword],
    };
    return Object.assign(validators, super.getValidators());
  }

}
