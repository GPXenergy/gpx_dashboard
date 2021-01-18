import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { mainTranslationsEn as translationsEN } from '@gpx/translations/en';
import { mainTranslationsNl as translationsNL } from '@gpx/translations/nl';
import { TranslationLoaderService } from '@gpx/services/translation-loader.service';
import { takeUntil } from 'rxjs/operators';
import { Config } from '@gpx/gpx-config/types';
import { ConfigService } from '@gpx/services/config.service';
import { AuthService } from '@gpx/services/auth.service';


@Component({
  selector: 'gpx-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  config: Config;
  // Private
  private readonly _unsubscribeAll: Subject<void> = new Subject();

  constructor(private _translationLoaderService: TranslationLoaderService,
              private authService: AuthService,
              private configService: ConfigService) {
    this._translationLoaderService.loadTranslations(translationsEN, translationsNL);
    this.authService.user.then(user => {
      /// Get the user for initial load
    });
  }

  ngOnInit(): void {
    // Subscribe to config changes
    this.configService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.config = config;
        // this.document.body.classList.add(this.oanaxConfig.colorTheme);
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
