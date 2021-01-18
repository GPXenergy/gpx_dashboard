import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from './cookie.service';
import { Config } from '../gpx-config/types';

// Create the injection token for the custom settings
export const _CONFIG = new InjectionToken('customConfig');

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public gxpconfig: Config;
  // Private
  private _configSubject: BehaviorSubject<Config>;
  private readonly _defaultConfig: Config;

  /**
   * Constructor
   *
   * @param cookieService
   * @param _config
   */
  constructor(
    private cookieService: CookieService,
    @Inject(_CONFIG) private _config
  ) {
    // Set the default config from the user provided config (from forRoot)
    const config: Config = this._config;
    if (this.cookieService.get('theme')) {
      config.colorTheme = this.cookieService.get('theme');
    }
      // listen to browser dark mode
      // else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      //   // dark mode
      //   config.colorTheme = 'theme-dark';
    // }
    else {
      config.colorTheme = 'theme-default';
    }


    this._defaultConfig = config;
    this.gxpconfig = config;


    // Initialize the service
    this._init();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get config(): Observable<Config> {
    return this._configSubject.asObservable();
  }

  /**
   * Set and get the config
   */
  set config(value) {
    // Get the value from the behavior subject
    let config = this._configSubject.getValue();

    // Merge the new config
    config = Object.assign({}, config, value);

    // Notify the observers
    this.gxpconfig = config;
    this._configSubject.next(this.gxpconfig);
  }

  /**
   * Get default config
   *
   * @returns {Config}
   */
  get defaultConfig(): Config {
    return this._defaultConfig;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Set config
   *
   * @param value
   * @param {{emitEvent: boolean}} opts
   */
  setConfig(value, opts = {emitEvent: true}): void {
    // Get the value from the behavior subject
    let config = this._configSubject.getValue();

    // Merge the new config
    config = Object.assign({}, config, value);
    this.gxpconfig = config;

    // If emitEvent option is true...
    if (opts.emitEvent === true) {
      // Notify the observers
      this._configSubject.next(config);
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get config
   *
   * @returns {Observable<Config>}
   */
  getConfig(): Observable<Config> {
    return this._configSubject.asObservable();
  }

  /**
   * Reset to the default config
   */
  resetToDefaults(): void {
    // Set the config from the default config
    // deep copy
    this.gxpconfig = this._defaultConfig;

    this._configSubject.next((JSON.parse(JSON.stringify(this._defaultConfig))));
  }

  /**
   * Initialize
   *
   * @private
   */
  private _init(): void {
    // Set the config from the default config
    // deep copy
    this._configSubject = new BehaviorSubject(JSON.parse(JSON.stringify(this._defaultConfig)));

  }
}

