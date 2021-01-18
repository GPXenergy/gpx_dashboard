import { Pipe } from '@angular/core';
import { DecimalPipe } from '@angular/common';


@Pipe({
  name: 'explicitNumber',
  pure: false
})
export class ExplicitDecimalPipe extends DecimalPipe {

  transform(value: any, digitsInfo?: string, locale?: string, invert?: boolean): any {
    if (invert) {
      value = -value;
    }
    const formatted = super.transform(value, digitsInfo, locale);
    return value > 0 ? `+${formatted}` : formatted;
  }

}
