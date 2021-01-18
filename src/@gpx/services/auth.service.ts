import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { AuthUser } from '../models/auth-user.model';
import { RootService } from './api/data.service';
import { LoginUser } from '../models/user.model';
import { modelPropertiesObj } from '../models/base';
import { catchError, map } from 'rxjs/operators';

/**
 * Interface for the data object response after authentication in the API
 */
interface AuthResponse {
  token?: string;
  expiry?: string;
  user: modelPropertiesObj<AuthUser>;
}

/**
 * Auth service provides tools to manage the authentication and authorization
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService extends RootService {
  private tokenCookieName = 'session';
  private expireCookieName = 'session-expiry';

  private _userPromise: Promise<AuthUser>;

  private _userUpdated: ReplaySubject<AuthUser> = new ReplaySubject(1);

  /**
   * Observable that can be used to listen to user changes, for example logging in or updating the current authenticated
   * user using the patch user method in this service.
   */
  get userUpdated(): Observable<AuthUser> {
    return this._userUpdated.asObservable();
  }

  private _user: AuthUser = null;

  /**
   * Get the user as a promise
   * - If token is not expired and we have a user locally: resolve the user
   * - If token is not expired and we dont have a user locally: get user from API
   * - Else this returns null (no user or token expired)
   */
  public get user(): Promise<AuthUser> {
    const expiry = new Date(this.cookieService.get(this.expireCookieName)),
      expired = !expiry || new Date() > expiry;
    if (this.token && this._user && !expired) {
      // User available locally and token is still valid
      return new Promise<AuthUser>((resolve, reject) => {
        resolve(this._user);
      });
    } else if (this.token && !expired) {
      // User not available, but we have a token and the token is not expired. Retrieve the user from the API
      if (!this._userPromise) {
        // use same promise for multiple calls at the same time
        this._userPromise = new Promise<AuthUser>((resolve, reject) => {
          this.refreshUser().subscribe(
            user => {
              // Resolve user
              resolve(user);
            },
            error => {
              // token is not valid, delete session
              this.logout();
              // Resolve null, user not authorized
              resolve(null);
            },
            () => {
              // Reset this user promise
              this._userPromise = null;
            }
          );
        });
      }
      return this._userPromise;
    } else if (expired) {
      this.logout();
    }
    // No user locally and no token or expired, a.k.a. no user for authorization
    return new Promise<AuthUser>((resolve) => {
      resolve(null);
    });
  }

  /**
   * Get auth token from cookie
   */
  public get token(): string {
    return this.tokenExpired ? null : this.cookieService.get(this.tokenCookieName);
  }

  /**
   * Check if token is expired
   */
  public get tokenExpired(): boolean {
    const expiry = new Date(this.cookieService.get(this.expireCookieName));
    return !expiry || new Date() > expiry;
  }

  /**
   * Try to login a user using username / password
   * @param loginCredentials: credentials model with username / password
   */
  public login(loginCredentials: LoginUser): Observable<AuthUser> {
    return this.http.post<AuthResponse>(
      this.buildUrl({type: 'login'}),
      JSON.stringify(loginCredentials),
      {headers: {Authorization: ''}}
    ).pipe(map(auth => this.save(auth)));  // Save the user if logged in successfully
  }

  /**
   * Hard refresh the user using the API, gets the user data from the api using the authentication token
   */
  public refreshUser(): Observable<AuthUser> {
    return this.http.get<AuthUser>(this.buildUrl({type: 'me'})).pipe(
      map(user => this.save({user: user}))
    ).pipe(
      catchError((err: any) => {
        this.logout();
        return throwError(err);
      })
    );
  }

  /**
   * Verify an authentication token
   * @param token
   */
  public verify(token: string): Observable<AuthUser> {
    this.cookieService.set(this.tokenCookieName, token);
    return this.refreshUser();
  }

  /**
   * Destroy the current session
   */
  public logout() {
    if (this.token) {
      this.http.post(this.buildUrl({type: 'logout'}), {}).subscribe(
        success => {/*ok*/
        },
        error => {/*ok*/
        }
      );
      this.cookieService.delete(this.tokenCookieName);
      this.cookieService.delete(this.expireCookieName);
    }
    this._user = null;
    this._userUpdated.next(null);
  }

  /**
   * Update the user locally, useful to reflect changes in components after updating for example
   * @param user
   */
  public patchUser(user): AuthUser {
    if (!this._user) {
      return null;
    }
    this._user.deserialize(user);
    this._userUpdated.next(this._user);
  }

  /**
   * Auth action url
   * type can be : verify | login | logout | logoutall
   */
  protected getActionUrl(): string {
    return '/api/auth/{{type}}/';
  }

  /**
   * The save is called after a successful login / refresh call that returned a user. It saves the auth token if
   * available and the user.
   * @param auth: auth response (includes user, token and expire info)
   */
  private save(auth: AuthResponse): AuthUser {
    if (auth.user) {
      if (auth.token && auth.token !== this.token) {
        this.cookieService.set(this.tokenCookieName, auth.token);
        this.cookieService.set(this.expireCookieName, auth.expiry);
      }
      if (this.token) {
        this._user = new AuthUser().deserialize(auth.user);
        this._userUpdated.next(this._user);
        return this._user;
      }
    }
    return null;
  }

}
