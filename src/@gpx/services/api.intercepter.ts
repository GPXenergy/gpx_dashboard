import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocaleService } from './locale.service';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SnackBarService } from './snack-bar.service';

/**
 * The api interceptor is registered in the app module to intercept all outgoing calls to the API. It adds
 * authorization and additional error handling by using the snackbar service.
 */
@Injectable({
  providedIn: 'root'
})
export class ApiInterceptor implements HttpInterceptor {

  constructor(private localeService: LocaleService,
              private authService: AuthService,
              private snackService: SnackBarService) {
  }

  /**
   * Intercepts an async call to remote
   * @param request: the request object
   * @param handler: http handler
   */
  intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
    // Add json content type as default
    if (!request.headers.has('Content-Type')) {
      request = request.clone({headers: request.headers.set('Content-Type', 'application/json')});
    }
    // Add authorization code if not yet present
    if (!request.headers.has('Authorization')) {
      const token = this.authService.token;
      if (token) {
        // Token is available
        request = request.clone({headers: request.headers.set('Authorization', `Token ${token}`)});
      }
    }
    const language: string = this.localeService.getCurrentLanguage().id;
    // Add language and accept types
    request = request.clone({headers: request.headers.set('Accept-Language', language)});
    request = request.clone({headers: request.headers.set('Accept', 'application/json')});

    // Execute the handler, catch any errors
    return handler.handle(request).pipe(
      catchError((err: any) => {
        return this.handleServerError(err);
      }),
    );
  }

  /**
   * Handles a server error in case of 40x or 50x
   * @param err: error object
   */
  private handleServerError(err: Error): Observable<any> {
    // If error is a response error and path is `not` the login url (dont show error on login page)
    if (err instanceof HttpErrorResponse && new URL(err.url).pathname !== '/') {
      switch (err.status) {
        case 401:
          // Authorization error (when user is not logged in, but action requires authentication)
          this.snackService.warn({
            title: 'Niet ingelogd',
            action: 'Login om verder te gaan',
            navigate_action: ['/login'],
          });
          break;
        case 403:
          // Forbidden error (when user is logged in but has no permission to do the action)
          this.snackService.warn({title: 'Geen permissie om deze actie uit te voeren'});
          break;
        case 0:
        case 500:
        case 501:
        case 502:
        case 503:
        case 504:
          // For all the server errors
          this.snackService.warn({title: 'Er is iets fout gegaan bij de server, probeer het nog eens of neem contact op'});
          break;
        default:
          // Not handling other error codes
          break;
      }
    }
    // Rethrow the err
    return throwError(err);
  }
}
