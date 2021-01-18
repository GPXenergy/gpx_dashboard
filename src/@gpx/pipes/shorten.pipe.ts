import { Pipe, PipeTransform } from '@angular/core';

/** Pipe to define maximum number of displayed characters
 usage: {{ value | shortenChars: NUMBER }}
 - where NUMBER is a positive integer
 **/

@Pipe({
  name: 'shortenChars'
})
export class ShortenPipe implements PipeTransform {
  transform(value: any, chars: number, showMore?: boolean, togglePipe?: boolean): any {
    if (!showMore) {
      if (value?.length > chars) {
        return value.substr(0, chars) + '..';
      }
    }
    if (showMore) {
      if (value?.length > chars && togglePipe) {
        return value.substr(0, chars);
      }
    }
    return value;
  }
}
