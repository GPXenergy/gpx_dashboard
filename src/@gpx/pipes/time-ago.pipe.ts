import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { TranslationLoaderService } from '@gpx/services/translation-loader.service';
import { locale as english } from './i18n/en';
import { locale as dutch } from './i18n/nl';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';


@Pipe({
  name: 'timeAgo',
  pure: false
})
export class TimeAgoPipe extends TranslatePipe implements PipeTransform {
  key: string;
  time: number | Date;
  nextMoment: number;

  constructor(private translationLoader: TranslationLoaderService,
              translateService: TranslateService,
              _ref: ChangeDetectorRef) {
    super(translateService, _ref);
    this.translationLoader.loadTranslations(english, dutch);
  }

  transform(value: any): any {
    // to prevent errors when date is not given
    if (!value) {
      return;
    }
    const toBeCheckedDate = new Date(value);
    const difference = new Date().getTime() - (toBeCheckedDate as Date).getTime();
    if (difference < this.nextMoment) {
      return this.translateDate();
    }
    this.nextMoment = difference + 60000; // next in 1 minute
    const minutes = Math.floor(difference / 1000 / 60);
    if (minutes > 4320) { // more than 3 days? just display date
      this.time = new Date(toBeCheckedDate);
    } else if (minutes > 1440) { // more than 1 day? display x days ago
      this.key = 'TIME_AGO.DAYS';
      this.time = Math.floor(minutes / 60 / 24);
    } else if (minutes > 60) { // more than 1 hour? display x hours ago
      this.key = 'TIME_AGO.HOURS';
      this.time = Math.floor(minutes / 60);
    } else {  // else just display x minutes ago
      this.key = 'TIME_AGO.MINUTES';
      this.time = Math.floor(minutes);
    }
    return this.translateDate();
  }

  translateDate(): string {
    if (this.time instanceof Date) {
      return this.time.toLocaleDateString('en-GB');
    }
    return super.transform(this.key, {time: this.time});
  }
}

