import { hasValidToken } from './Jwt';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(public router: Router) { }

  canActivate(activatedRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let role = (<any>activatedRoute.routeConfig).role;
    if (role === 'TachographCentre' && hasValidToken()) {
      return true;
    }

    if (role === 'Administrator' && hasValidToken(['Administrator'])) {
      return true;
    }

    if (role === 'DirectUpload' && hasValidToken(['DirectUpload', 'Administrator'])) {
      return true;
    }

    this.router.navigate(['login']);
    return;
  }
}
