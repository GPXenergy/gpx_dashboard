import { AbstractControl, AsyncValidatorFn, FormArray, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { BaseModel, modelPropertiesObj } from '../models/base';
import { FormBuilder } from './form-builder';
import { Injectable } from '@angular/core';
import { FormValidatorService, IRemoteErrors } from './validator.service';
import { FormErrors } from './form-error.model';
// import { QueryParams, QueryParams_t } from '../services/api/data.service';
// import { QueryParamsService } from '../services/query-params.service';

type controlConfigType<T> = {
  [key in keyof T]?: [T[key]] | [T[key] | {value: T[key], [key: string]: any}, (ValidatorFn | ValidatorFn[])] | AbstractControl
};

interface IControlConfig {
  [key: string]: any;
}

/**
 * Builder for model forms. Based on angular reactive forms (https://angular.io/guide/reactive-forms)
 *
 * Helps with creating form classes for models (extending BaseModel). Applies the model validators to
 * the form and returns fully working forms.
 *
 * for more info, visit https://angular.io/api/forms/FormBuilder
 */
@Injectable({
  providedIn: 'root'
})
export class ModelFormBuilder extends FormBuilder {
  constructor(private formValidatorService: FormValidatorService) {
    super();
  }

  // /**
  //  * Create a new group for given filter.
  //  * @param {{new(): T}} construct : The model class (User, for example)
  //  * @param {controlConfigType} filterControlsConfig : Dict with {field name : [initial value, validators...], ...}
  //  * @param queryParamsService
  //  * @param {IControlConfig | null} extra : extra config
  //  * @return ModelFormGroup
  //  */
  // filterGroup<T extends QueryParams>(construct: new() => T,
  //                                    filterControlsConfig: controlConfigType<T>,
  //                                    queryParamsService?: QueryParamsService<T>,
  //                                    extra?: IControlConfig): FilterFormGroup<T> {
  //   return new FilterFormGroup(construct, this.formValidatorService, this.group(filterControlsConfig, extra), queryParamsService, extra);
  // }


  /**
   * Create a new group for given model.
   * @param {{new(): T}} construct : The model class (User, for example)
   * @param {T} initialModel: the initial model, to pre-fill the form.
   * @param {controlConfigType} modelControlsConfig : Dict with {field name : [initial value, validators...], ...}
   * @param {IControlConfig | null} extra : extra config
   * @return ModelFormGroup
   */
  modelGroup<T extends BaseModel>(construct: new() => T, initialModel: T,
                                  modelControlsConfig: controlConfigType<T>,
                                  extra?: IControlConfig): ModelFormGroup<T> {
    const controlsConfig = this.applyModelValidators(construct, modelControlsConfig);
    return new ModelFormGroup(construct, initialModel, this.formValidatorService, this.group(controlsConfig, extra), extra);
  }

  /**
   * Create a new array of groups for given model.
   * @param {{new(): T}} construct : The model class (Tags, for example)
   * @param {T[]} initialModels: the initial models, to pre-fill the form.
   * @param {controlConfigType<T extends BaseModel>} modelControlsConfig : Dict with {field name : [initial value, validators...], ...}
   * @param {ValidatorFn | ValidatorFn[] | null} validator: Validator for this array (like CustomValidators max array length)
   * @param {AsyncValidatorFn | AsyncValidatorFn[] | null} asyncValidator: ...
   * @return ModelFormArray
   */
  modelArray<T extends BaseModel>(construct: new() => T, initialModels: T[],
                                  modelControlsConfig: controlConfigType<T>,
                                  validator?: ValidatorFn | ValidatorFn[] | null,
                                  asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): ModelFormArray<T> {
    if (!initialModels) {
      initialModels = [];
    }
    const modelFGs = initialModels.map(model => this.modelGroup(construct, model, modelControlsConfig));
    return new ModelFormArray(this, modelControlsConfig, construct, initialModels, this.formValidatorService, this.array(modelFGs, validator, asyncValidator));
  }

  /**
   * Applies the model validators
   */
  private applyModelValidators<T extends BaseModel>(construct: new() => T, controlsConfig: controlConfigType<T>): IControlConfig {
    const modelValidators = new construct().getValidators();
    Object.keys(controlsConfig).forEach(fieldName => {
      if (modelValidators.hasOwnProperty(fieldName)) {
        const config = controlsConfig[fieldName];
        if (config instanceof AbstractControl) {
          // Compose new validator based on existing in control + model validators
          config.setValidators(Validators.compose([config.validator].concat(modelValidators[fieldName])));
        } else if (config instanceof Array) {
          if (config.length === 0) {
            config[0] = null;
          }
          if (config.length === 1) {
            config[1] = [];
          }
          // Compose new validator based given from config + model validators
          const givenValidators = (config[1] instanceof Array) ? config[1] : [config[1]];
          config[1] = Validators.compose(givenValidators.concat(modelValidators[fieldName]));
        }
        controlsConfig[fieldName] = config;
      }
    });
    return controlsConfig;
  }
}


class ErrorFormGroup extends FormGroup {
  private readonly _formValidatorService: FormValidatorService;
  private readonly _errorMessages: FormErrors;

  constructor(formValidatorService, formGroup: FormGroup, extra?: IControlConfig | null) {
    super(formGroup.controls, extra || formGroup.validator);
    this._formValidatorService = formValidatorService;
    this._errorMessages = new FormErrors(this);
  }

  get errorMessages(): FormErrors {
    return this._errorMessages;
  }

  public runValidation(): void {
    this._formValidatorService.validateForm(this, this._errorMessages);
  }

  public applyRemoteErrors(remoteErrors: IRemoteErrors): void {
    this._formValidatorService.applyRemoteErrors(this, this._errorMessages, remoteErrors);
  }

}


// export class  FilterFormGroup<T extends QueryParams> extends ErrorFormGroup {
//   private _filterUpdated = new ReplaySubject<T>(1);
//   private readonly _initialData: QueryParams_t<T> = {};
//   private lastValues: QueryParams_t<T> = {};
//   private wasSame = false;

//   constructor(private construct: new() => T, formValidatorService, formGroup: FormGroup,
//               private queryParamsService: QueryParamsService<T>, extra?: IControlConfig | null) {
//     // Copy form group
//     super(formValidatorService, formGroup, extra || formGroup.validator);
//     this._initialData = this.value;
//     this.valueChanges.subscribe((values) => {
//       for (const [key, value] of Object.entries(values)) {
//         if (this.lastValues[key] !== value) {
//           this.wasSame = false;
//           break;
//         }
//         this.wasSame = true;
//       }
//       this.runValidation();
//       if (!this.wasSame && this.valid) {
//         // reset page to 1 if not dirty
//         if (this.lastValues.page > 1 && values.page === this.lastValues.page) {
//           this.get('page').setValue(1, {emitEvent: false});
//         }
//         this.lastValues = this.value;
//         const filter = this.getFilter();
//         if (this.queryParamsService) {
//           this.queryParamsService.applyFilter(filter);
//         } else {
//           this._filterUpdated.next(filter);
//         }
//       }
//     });

//     if (this.queryParamsService) {
//       this.queryParamsService.paramsUpdated.subscribe(values => {
//         let update = Object.keys(values).length > 0 && !this.wasSame;
//         for (const [key, value] of Object.entries(this._initialData)) {
//           if (values[key] === undefined) {
//             values[key] = value;
//           }
//         }
//         for (const [field, control] of Object.entries(this.controls)) {
//           if (control instanceof FormArray) {
//             const formValue = control.value,
//               paramValue = values[field] !== null && values[field] !== undefined && values[field] !== '' ? values[field] instanceof Array ? values[field] : [values[field]] : [];
//             if (!arraysEqual(formValue, paramValue)) {
//               update = true;
//               control.controls = paramValue.map(val => new FormControl(val));
//               control.updateValueAndValidity({emitEvent: false});
//             }
//             delete values[field];
//           }
//         }
//         this.patchValue(values);
//         if (update || !this.wasSame) {
//           this._filterUpdated.next(this.getFilter());
//           this.wasSame = true;
//         }
//       });
//     }
//     this.patchValue({});
//   }

//   patchValue(value: QueryParams_t<T> | T, options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
//     super.patchValue(simplifyObject(value), options);
//   }

//   public getFilter(): T {
//     return new this.construct().assign(this.getRawValue());
//   }

//   public get filterUpdated(): Observable<T> {
//     return this._filterUpdated.asObservable();
//   }

//   clear(): void {
//     this._filterUpdated.complete();
//   }
// }


export class ModelFormGroup<T extends BaseModel> extends ErrorFormGroup {
  constructor(private construct: new() => T, public initialModel: T, formValidatorService, formGroup: FormGroup, extra?: IControlConfig | null) {
    // Copy form group
    super(formValidatorService, formGroup, extra || formGroup.validator);
    if (initialModel) {
      this.patchValue(initialModel);
    }
    this.valueChanges.subscribe(() => {
      this.runValidation();
    });
  }

  patchValue(value: modelPropertiesObj<T> | T, options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    super.patchValue(simplifyObject(value), options);
  }

  public getModel(): T {
    return new this.construct().deserialize(this.getRawValue());
  }

  public getGroup<getT extends BaseModel>(name: string): ModelFormGroup<getT> {
    return this.get(name) as ModelFormGroup<getT>;
  }

  public getArray<getT extends BaseModel>(name: string): ModelFormArray<getT> {
    return this.get(name) as ModelFormArray<getT>;
  }
}


export class ModelFormArray<T extends BaseModel> extends FormArray {
  private readonly _formValidatorService: FormValidatorService;

  constructor(private fb: ModelFormBuilder, private config: IControlConfig, private construct: new() => T, public initialModels: T[], formValidatorService, formArray: FormArray) {
    // Copy form array
    super(formArray.controls, formArray.validator, formArray.asyncValidator);
    if (initialModels && initialModels.length > 0) {
      this.patchValue(initialModels);
    }
    this._formValidatorService = formValidatorService;
  }

  patchValue(value: (modelPropertiesObj<T> | T)[], options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    value = value.map((model: T) => simplifyObject(model));
    super.patchValue(value, options);
  }

  pushNewModel(obj: modelPropertiesObj<T> | T = {}) {
    super.push(this.newModelFormGroup(obj));
  }

  insertNewModel(index: number, obj: modelPropertiesObj<T> | T = {}) {
    super.insert(index, this.newModelFormGroup(obj));
  }

  at(index: number): ModelFormGroup<T> {
    return super.at(index) as ModelFormGroup<T>;
  }

  push(control: AbstractControl): void {
    throw new Error('Use pushNewModel instead of push');
  }

  insert(index: number, control: AbstractControl): void {
    throw new Error('Use insertNewModel instead of insert');
  }

  public getModels(): T[] {
    return this.getRawValue().map(obj => new this.construct().deserialize(obj));
  }

  private newModelFormGroup(obj: Object | T = {}): ModelFormGroup<T> {
    // new copy of template, so control data wont be copied
    return new ModelFormGroup(this.construct, obj as T, this._formValidatorService, this.fb.group(this.config));
  }
}

/**
 * copy of given object, but removing the properties that are sub objects.
 * @param obj
 */
function simplifyObject(obj: any): any {
  if (!(obj instanceof Object)) {
    // Can't assign simple value to group / array
    return {};
  }
  const modelObj = Object.assign({}, obj);
  for (const key of Object.keys(modelObj)) {
    if (modelObj[key] instanceof Object) {
      if (modelObj[key]['pk']) {
        // Value will be pk
        modelObj[key] = modelObj[key]['pk'];
      } else {
        // Invalid value
        delete modelObj[key];
      }
    }
  }
  return modelObj;
}

function arraysEqual(a: any[], b: any[]) {
  if (a === b) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  a = a.slice().sort();
  b = b.slice().sort();
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
