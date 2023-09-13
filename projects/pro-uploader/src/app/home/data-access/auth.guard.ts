import { AppState } from '@app/shared/state/app.state';
import { Injectable } from '@angular/core';
import { isAuthenticated } from './auth.selectors';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

@Injectable({ 
  providedIn: 'root' 
})
export class AuthGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.store.select(isAuthenticated).pipe(
      map((authenticate) => {
        if (!authenticate) {
          return this.router.createUrlTree(['home']);
        }
        return true;
      })
    );
  }

  constructor(private store: Store<AppState>, private router: Router) { }
}
