import { Injectable } from '@angular/core';
import { DomainService } from './domain.service';

/**
 * @property  {string} path Path relative to the domain where the cookie should be avaiable. Default /
 * @property  {string} domain Domain where the cookie should be avaiable. Default current domain
 */
interface CookieProperties {
  path?: string;
  domain?: string;
}

/**
 * @property  {number | Date} expires Cookie's expiration date in days from now or at a specific date from a Date object. If it's undefined the cookie is a session Cookie
 * @property  {boolean} secure If true, the cookie will only be available through a secured connection
 */
interface CookieOptions extends CookieProperties {
  expires?: number | Date;
  secure?: boolean;
}

type CookieValue = string;

interface Cookies {
  [key: string]: CookieValue;
}

/**
 * Cookie service that handles browser cookies (get / update / delete)
 */
@Injectable({
  providedIn: 'root'
})
export class CookieService {
  private _defaults: CookieOptions;

  constructor(private domainService: DomainService) {
    this._defaults = {
      expires: 112, // 4 months
      path: '/',
      domain: this.domainService.domainInfo('global').domain,
      secure: this.domainService.domainInfo('global').secure
    };
  }

  private get defaultCookieOpts(): CookieOptions {
    return Object.assign({}, this._defaults);
  }

  /**
   * Checks the existence of a single cookie by it's name
   * @param  {string} name of the cookie
   * @returns true if cookie exists
   */
  public check(name: string): boolean {
    // Check if document exist avoiding issues on server side prerendering
    if (typeof document === 'undefined') {
      return false;
    }
    name = encodeURIComponent(name);
    const regexp = new RegExp('(?:^' + name + '|;\\s*' + name + ')=(.*?)(?:;|$)', 'g');
    return regexp.test(document.cookie);
  }

  /**
   * Retrieves a single cookie by it's name
   * @param  {string} name Identification of the Cookie
   * @returns The Cookie's value
   */
  public get(name: string): CookieValue {
    if (!this.check(name)) {
      return '';
    }
    name = encodeURIComponent(name);
    const regexp = new RegExp('(?:^' + name + '|;\\s*' + name + ')=(.*?)(?:;|$)', 'g');
    const result = regexp.exec(document.cookie);
    return decodeURIComponent(result[1]);
  }

  /**
   * Retrieves a a list of all available cookies
   * @returns all cookies and their values
   */
  public getAll(): Cookies {
    const cookies: Cookies = {};
    if (document.cookie && document.cookie !== '') {
      const split = document.cookie.split(';');
      for (const s of split) {
        const currCookie = s.split('=');
        cookies[decodeURIComponent(currCookie[0].trim())] = decodeURIComponent(currCookie[1]);
      }
    }
    return cookies;
  }

  /**
   * Save a cookie
   * @param  {string} name: cookie name
   * @param  {CookieValue} value: cookie value
   * @param  {CookieOptions} opts: additional options
   */
  public set(name: string, value: CookieValue, opts?: CookieOptions) {
    opts = Object.assign(this.defaultCookieOpts, opts);

    let cookieStr = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';';

    if (typeof opts.expires === 'number') {
      const dtExpires = new Date(new Date().getTime() + opts.expires * 1000 * 60 * 60 * 24);
      cookieStr += 'expires=' + dtExpires.toUTCString() + ';';
    } else {
      cookieStr += 'expires=' + opts.expires.toUTCString() + ';';
    }
    cookieStr += 'path=' + opts.path + ';';
    cookieStr += 'domain=' + opts.domain + ';';
    cookieStr += opts.secure ? 'SameSite=None;Secure;' : '';
    document.cookie = cookieStr;
  }

  /**
   * Removes specified cookie
   * @param  {string} name Cookie's identification
   */
  public delete(name: string): void {
    this.set(name, '', {expires: -1});
  }

  /**
   * Delete all cookies
   */
  public deleteAll(): void {
    const cookies = this.getAll();
    for (const cookieName of Object.keys(cookies)) {
      this.delete(cookieName);
    }
  }

  /**
   * Sets cookie that visitor has accepted cookies
   */
  public acceptCookies() {
    this.set('cookies-accepted', '1');
  }

  /**
   * Checks if the visitor has accepted cookies
   */
  public hasAcceptedCookies(): boolean {
    return this.check('cookies-accepted');
  }

  /**
   * Test is cookies can be set. Sets a test cookie and deletes it afterward.
   */
  public canSetCookie(): boolean {
    if (this.hasAcceptedCookies()) {
      return true;
    }
    this.set('test-cookie', '1');
    if (this.check('test-cookie')) {
      this.delete('test-cookie');
      return true;
    }
    return false;
  }
}
