import { $pf, DealerService } from 'pfshared/pfapi';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AppState } from '@app/shared/state/app.state';
import { AuthService } from './auth.service';
import {
  catchError,
  exhaustMap,
  finalize,
  map,
  take,
  tap
} from 'rxjs/operators';
import { environment } from 'projects/pro-uploader/src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IsBusyService } from 'pfshared/is-busy';
import { NGXLogger } from 'ngx-logger';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { selectCurrentSettings } from '@app/settings/data-access/settings.selectors';
import { Store } from '@ngrx/store';
import { ToastService } from '@app/shared/ui/toast/toast.service';
import { UploadService } from '@app/uploads/data-access/upload.service';
import {
  autoLogin,
  login,
  loginFailure,
  loginSuccess,
  logout,
} from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private busyService: IsBusyService,
    private dealerService: DealerService,
    private logger: NGXLogger,
    private router: Router,
    private store: Store<AppState>,
    private toastService: ToastService,
    private uploadService: UploadService
  ) { }

  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(autoLogin),
      exhaustMap((action) => {
        this.busyService.add({ key: ['default', 'login'] });
        return this.authService.autoLogin().pipe(
          // Return a new success action containing the user information
          map(user => loginSuccess({ user, redirect: false })),
          // Or... if it errors return a new failure action containing the error (quietly)
          catchError((error) => of(loginFailure({ error, quiet: true }))),
          finalize(() => this.busyService.remove({ key: ['default', 'login'] }))
        );
      })
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap((action) => {
        this.busyService.add({ key: ['default', 'login'] });
        return this.authService.login(action.credentials.dealerCode, action.credentials.username, action.credentials.password, action.credentials.rememberMe).pipe(
          // Return a new success action containing the user information
          map(user => loginSuccess({ user, redirect: false })),
          // Or... if it errors return a new failure action containing the error
          catchError((error) => of(loginFailure({ error }))),
          finalize(() => this.busyService.remove({ key: ['default', 'login'] }))
        );
      })
    )
  );

  loginFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginFailure),
      tap((action) => this.logger.error(action.error)),
      tap((action) => {
        if (!action.quiet) {
          this.toastService.showError(action.error.error.Message ?? action.error);
        }
      })
    ),
    { dispatch: false }
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess),
      tap((action) => {
        if (action.user) {
          $pf.dealer.code = action.user?.DealerCode;

          // update logger config with dealer code
          var loggerConfig = this.logger.getConfigSnapshot();
          loggerConfig.customHttpParams = new HttpParams().set("dealerCode", $pf.dealer.code);
          this.logger.updateConfig(loggerConfig);

          // start watching for uploads
          this.store.select(selectCurrentSettings).pipe(take(1)).subscribe(settings => {
            this.uploadService.start(settings);
          });

          this.dealerService.getDealer($pf.dealer.code).subscribe(dealer => {
            // setup domain
            let domain = `https://${dealer.Website}`;
            let isProduction = environment.production;
            let isSandbox = environment.sandbox;

            if (!isProduction && !isSandbox) {
              domain = domain.replace("photofinale.com", "localhost.com");
            }

            // if (isSandbox) {
            //   domain = domain.replace("photofinale.com", "pfsandbox.com");
            // }

            console.log(domain);
            $pf.domain = domain;
          })
        }
        //if (action.redirect) {
        this.router.navigate(['/orders']);
        //}
      })
    ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      exhaustMap((action) => {
        return this.authService.logout().pipe(
          finalize(() => this.router.navigate(['home']))
        );
      })
    ),
    // Most effects dispatch another action, but this one is just a "fire and forget" effect
    { dispatch: false }
  );
}
