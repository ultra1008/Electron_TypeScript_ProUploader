import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { DealersService } from 'pfshared/pfapi';
import { catchError, delay, EMPTY, Observable, switchMap, tap } from 'rxjs';
import { LoginCredentials, LoginStatus } from './login.model';

export interface LoginState {
  status: LoginStatus;
}

@Injectable()
export class LoginStore extends ComponentStore<LoginState> {
  status$ = this.select((state) => state.status);

  login = this.effect(
    (credentials$: Observable<LoginCredentials>) => credentials$.pipe(
      tap(() => this.setState({ status: 'authenticating' })),
      switchMap((credentials) =>
        this.dealersService.login(credentials.dealerCode, credentials.username, credentials.password).pipe(
          tap({
            next: (success) => this.setState({ status: 'success' }),
            error: (err) => this.setState({ status: 'error' }),
            finalize: () => this.pending()
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  pending = this.effect(
    $ => $.pipe(
      delay(1500),
      tap(() => this.setState({ status: 'pending' }))
    )
  );

  constructor(private dealersService: DealersService) {
    super({ status: 'pending' });
  }
}
