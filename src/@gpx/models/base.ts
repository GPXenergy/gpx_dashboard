import { ValidatorFn, Validators } from '@angular/forms';

export { ValidatorFn, Validators } from '@angular/forms';


export type pkType = number;  // Primary key type
export type modelRelation<T extends BaseModel> = pkType | T;  // Model relation between models (as pk or model)
export type modelRelationArray<T extends BaseModel> = modelRelation<T>[];  // Model relation between models (as pk or model), as array

type modelProperty<T extends BaseModel> = keyof T;  // A property of model
export type modelProperties<T extends BaseModel, V = any> = { [key in modelProperty<T>]?: V };  // Object of model properties with any given values
export type modelPropertiesObj<T extends BaseModel> = { [key in modelProperty<T>]?: T[key] };  // Object of model properties with any given values
export type propertyValidators<T extends BaseModel> = modelProperties<T, ValidatorFn[]>;  // Object model properties and validator function values


export abstract class BaseModel {
  public pk: pkType;

  /**
   * Returns the model from the model
   */
  protected static getModelProperty<T extends BaseModel>(construct: new () => T, property: modelRelation<T>): T {
    if (property instanceof construct) {
      return property as T;
    } else if (typeof property === 'number') {
      return new construct().deserialize({pk: property as pkType} as modelPropertiesObj<T>);
    } else if (property) {
      throw TypeError('Missing createRelation assignment in the model createModelRelations');
    }
    return null;
  }

  protected static getModelPropertyArray<T extends BaseModel>(construct: new () => T, property: modelRelationArray<T>): T[] {
    if (property && property.length > 0) {
      return property[0] instanceof construct ? property as T[] : property.map(value => BaseModel.getModelProperty(construct, value));
    }
    return property as T[];
  }

  public deserialize(values: modelPropertiesObj<this>): this {
    const toApply = Object.assign({}, values);
    this.createModelRelations(toApply);
    for (const [key, value] of Object.entries(toApply)) {
      if (value !== undefined) {
        this[key] = value;
      }
    }
    this.cleanFields();
    return this;
  }

  /**
   * get list of validators for each property
   * @return {propertyValidators}: dict with [property]: validators[]
   */
  public getValidators(): propertyValidators<BaseModel> {
    return {
      pk: []
    };
  }

  /**
   * Create relations from given values. All modelRelation properties for the model should be created in this
   * @param values
   */
  protected createModelRelations(values: modelPropertiesObj<this>): void {
  }

  /**
   * Clean fields, for example create Date objects or convert decimal strings to numbers
   */
  protected cleanFields(): void {
  }

  protected createRelation<T extends BaseModel>(construct: new () => T, values: modelProperties<this>, field: modelProperty<this>) {
    if (values.hasOwnProperty(field)) {
      if (this[field] instanceof construct) {
        (this[field] as unknown as T).deserialize(values[field]);
      } else {
        this[field] = makeRelatedProperty(construct, values[field]) as unknown as this[keyof this];
      }
      delete values[field];
    }
  }

  protected createArrayRelation<T extends BaseModel>(construct: new () => T, values: modelProperties<this>, field: modelProperty<this>) {
    if (values.hasOwnProperty(field)) {
      // if (this[field] !== undefined) {
      // TODO array overwrite logic
      // }
      this[field] = makeRelatedPropertyArray(construct, values[field]) as unknown as this[keyof this];
      delete values[field];
    }
  }

  public asObject(): modelPropertiesObj<this> {
    return Object.keys(this).reduce((obj, key) => {
      const value = this[key];
      if (key.startsWith('_') || value instanceof Function) {
        // Ignore values starting with _, to ignore cached values or other private properties
        return obj;
      }
      if (value instanceof Array && value.length > 0 && value[0] instanceof BaseModel) {
        obj[key] = value.map((m) => m.asObject());
      } else if (value instanceof BaseModel) {
        obj[key] = value.asObject();
      } else if (value !== undefined) {
        obj[key] = value;
      }
      return obj;
    }, {});
  }
}


function makeRelatedProperty<T extends BaseModel>(construct: new () => T, value: (modelPropertiesObj<T> | pkType)): modelRelation<T> {
  if (value && value instanceof Object) {
    return new construct().deserialize(value as modelPropertiesObj<T>);
  }
  return value as pkType;

}

function makeRelatedPropertyArray<T extends BaseModel>(construct: new () => T, values: (modelPropertiesObj<T> | pkType)[]): modelRelationArray<T> {
  return values.map(value => makeRelatedProperty(construct, value));
}
