import { AbstractControlOptions, FormBuilder as AngularFB, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';

/**
 * Because angular's form builder is out of date...
 */
@Injectable({
  providedIn: 'root'
})
export class FormBuilder extends AngularFB {
  group(controlsConfig: {
    [key: string]: any;
  }, extra?: {
    [key: string]: AbstractControlOptions | any;
  } | null): FormGroup {
    return new FormGroup(super.group(controlsConfig).controls, extra);
  }
}
