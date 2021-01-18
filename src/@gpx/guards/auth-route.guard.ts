import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { GuardKeeper } from './guard.guard';


@Injectable({
  providedIn: 'root'
})
export class LoginRequiredGuard implements CanActivate {
  constructor(private guard: GuardKeeper) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.guard.isLoggedIn().then(loggedIn => {
      if (!loggedIn) {
        this.guard.redirectToLogin(state.url);
        return false;
      }
      return true;
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoginRequiredChildrenGuard implements CanActivateChild {
  constructor(private guard: GuardKeeper) {
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.guard.isLoggedIn().then(loggedIn => {
      if (!loggedIn) {
        this.guard.redirectToLogin(state.url);
        return false;
      }
      return true;
    });
  }
}
