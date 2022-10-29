import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { mainTranslationsEn as translationsEN } from '@gpx/translations/en';
import { mainTranslationsNl as translationsNL } from '@gpx/translations/nl';
import { TranslationLoaderService } from '@gpx/services/translation-loader.service';
import { AuthService } from '@gpx/services/auth.service';


@Component({
  selector: 'gpx-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly _unsubscribeAll: Subject<void> = new Subject();

  constructor(private _translationLoaderService: TranslationLoaderService,
              private authService: AuthService) {
    this._translationLoaderService.loadTranslations(translationsEN, translationsNL);
    this.authService.user.then(user => {
      /// Get the user for initial load
    });
  }

  ngOnInit(): void {
    //
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
