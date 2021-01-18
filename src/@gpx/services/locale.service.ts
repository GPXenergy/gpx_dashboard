import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from './cookie.service';

// import {DomainService} from './domain.service';

export interface LanguageInfo {
  id: string;
  title: string;
  flag: string;
}

/**
 * Language service, currently only handling NL
 */
@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  private readonly langCookieName = 'lang';
  private readonly defaultLanguage = 'nl';
  private readonly supportedLanguages = ['nl'];  // TODO: ['en', 'nl'];
  private readonly languages: LanguageInfo[];
  private currentLanguage: LanguageInfo;

  constructor(private translate: TranslateService, private cookieService: CookieService) {
    this.translate.addLangs(this.supportedLanguages);
    this.translate.setDefaultLang(this.defaultLanguage);
    this.languages = [
      {
        'id': 'nl',
        'title': 'Nederlands',
        'flag': 'nl'
      },
      // {
      //   'id': 'en',
      //   'title': 'English',
      //   'flag': 'en'
      // },
    ];

    // Set language from cookie, else from browser, else the default language (nl)
    const cookieLanguage = cookieService.get(this.langCookieName);
    if (cookieLanguage && this.isLanguageSupported(cookieLanguage)) {
      this.useLang(cookieLanguage);
    } else if (navigator.language && this.isLanguageSupported(navigator.language)) {
      this.useLang(navigator.language);
    } else {
      this.useLang(this.defaultLanguage);
    }
  }

  /**
   * Returns current selected language
   */
  public getCurrentLanguage(): LanguageInfo {
    return this.currentLanguage;
  }

  /**
   * Returns all supported languages
   */
  public getLanguages(): LanguageInfo[] {
    return this.languages;
  }

  /**
   * Returns all supported languages as id
   */
  public getLanguageIds(): string[] {
    return this.supportedLanguages;
  }

  /**
   * Change language
   * @param langId
   */
  useLang(langId: string): LanguageInfo {
    const language = this.languages.find(lang => lang.id === langId);
    if (language && language.id !== this.currentLanguage?.id) {
      // Set new current language
      this.currentLanguage = language;
      // Store selection in cookie
      this.cookieService.set(this.langCookieName, language.id);
      // Update the translation service with new language
      this.translate.use(language.id);
    }
    return this.currentLanguage;
  }

  /**
   * checks if given language code is supported
   * @param langId
   */
  isLanguageSupported(langId: string): boolean {
    return this.supportedLanguages.indexOf(langId) > -1;
  }
}
