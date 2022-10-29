import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { NavigationBehaviorService } from '@gpx/services/navigation-behavior.service';
import { LanguageInfo, LocaleService } from '@gpx/services/locale.service';
import { User } from '@gpx/models/user.model';
import { AuthService } from '@gpx/services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';


@Component({
  selector: 'gpx-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ToolbarComponent implements OnInit, OnDestroy {

  languages: LanguageInfo[];
  selectedLanguage: LanguageInfo;

  user: User;

  // Private
  private _unsubscribeAll = new Subject<void>();

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private _sideNavigationService: NavigationBehaviorService,
              private _localeService: LocaleService,
              private authService: AuthService,
              public router: Router) {
  }


  ngOnInit(): void {
    this.selectedLanguage = this._localeService.getCurrentLanguage();
    this.authService.userUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe(user => {
      // triggers when user is updated
      this.user = user;
      this.changeDetectorRef.detectChanges();
    });
  }

  toggleSidebar(): void {
    this._sideNavigationService.toggleSideNav();
  }

  setLanguage(lang): void {
    // Use the selected language for translations
    this.selectedLanguage = this._localeService.useLang(lang.id);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }


}
