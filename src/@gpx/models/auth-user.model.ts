import { BaseModel, modelPropertiesObj, modelRelation } from './base';
import { User } from './user.model';
import { Meter } from './meter.model';


/**
 * AuthUser model
 */
export class AuthUser extends User {
  api_key: string;
  default_meter: modelRelation<Meter>;
  confirm_password: string;

  public getDefaultMeter(): Meter {
    return BaseModel.getModelProperty(Meter, this.default_meter);
  }

  cleanFields(): void {
    super.cleanFields();
    if (this.first_name && this.last_name) {
      this.display_name = this.first_name + ' ' + this.last_name;
    } else {
      this.display_name = this.username;
    }
  }

  protected createModelRelations(values: modelPropertiesObj<this>): void {
    super.createModelRelations(values);
    this.createRelation(User, values, 'default_meter');
  }

}
