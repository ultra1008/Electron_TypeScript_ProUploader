import { $pf, Dealer, DealerService } from 'pfshared/pfapi';
import { AppState } from '@app/shared/state/app.state';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  EMPTY,
  from,
  Observable,
  switchMap
} from 'rxjs';
import { isAuthenticated, isPending } from '../data-access/auth.selectors';
import { logout } from '../data-access/auth.actions';
import { Store } from '@ngrx/store';

interface AppInfo {
  name?: string;
  version?: string;
}

@Component({
  selector: 'app-home',
  template: `
    <div class="text-center position-relative w-100">
      <h1 class="mb-5">{{'HOME.WELCOME' | translate}}</h1>

      <ng-container *ngIf="isAuthenticated$ | async">
        <ng-container *ngIf="dealer$ | async as dealer; else loading">
          <div class="dealer-container">
            <div class="card mb-3">
              <div class="row g-0">
                <div class="col-md-4 p-3">
                  <img [src]="dealer.ThumbnailLogo" class="img-fluid rounded-start" alt="...">
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">{{dealer.Name}}</h5>
                    <div class="card-text">{{dealer.Address}}</div>
                    <div class="card-text">{{dealer.City}}, {{dealer.State}} {{dealer.Zip}}</div>
                    <div class="card-text">{{dealer.ContactName}}</div>
                    <div class="card-text">{{dealer.ContactPhone}}</div>
                    <div class="card-text">
                      <small class="text-muted">
                        <a href="https://{{dealer.Website}}" target="blank">{{dealer.Website}}</a>
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="actions d-flex justify-content-end">
              <button type="button" class="btn btn-link" (click)="logoutClicked()">{{'_.LOGOUT' | translate}}</button>
            </div>
          </div>
        </ng-container>
        <ng-template #loading>
          <div class="dealer-container">
            <div class="card mb-3">
              <div class="row g-0">
                <div class="col-md-4 p-3">
                  <span class="placeholder w-75 h-75"></span>
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title placeholder-glow"><span class="placeholder col-8"></span></h5>
                    <div class="card-text placeholder-glow">
                      <span class="placeholder col-7"></span>
                      <span class="placeholder col-4"></span>
                      <span class="placeholder col-6"></span>
                      <span class="placeholder col-1"></span>
                      <span class="placeholder col-3"></span>
                      <span class="placeholder col-8"></span>
                      <span class="placeholder col-6"></span>
                      <span class="placeholder col-8"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ng-template>
      </ng-container>

      <ng-container *ngIf="!(isAuthenticated$ | async)">
        <div class="login-container">
          <app-login-form></app-login-form>
        </div>
      </ng-container>

      <div class="footer-container" *ngIf="appInfo$ | async as appInfo">
        <h5>Version {{appInfo.version}}</h5>
        <h6>Copyright &copy; {{now}} Photo Finale Inc.</h6>
      </div>
    </div>
  `,
  styles: [`
    :host {
      height: 100vh;
      display: flex;
      padding: 40px 0;

      .dealer-container {
        max-width: 540px;
        margin: auto;
        text-align: center;

        .card-body {
          text-align: left;

          .placeholder {
            margin-right: .5em;
          }
        }
      }

      .login-container {
        max-width: 400px;
        padding: 15px;
        margin: auto;
      }

      .footer-container {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage implements OnInit {
  constructor(
    private dealerService: DealerService,
    private store: Store<AppState>
  ) { }

  now = new Date().getFullYear();
  appInfo$: Observable<AppInfo>;

  isAuthenticated$: Observable<boolean> = this.store.select(isAuthenticated);
  dealer$: Observable<Dealer> = this.isAuthenticated$.pipe(
    switchMap(isAuthenticated => isAuthenticated ? this.dealerService.getDealer($pf.dealer.code) : EMPTY)
  );

  readonly isPending$ = this.store.select(isPending);
  
  ngOnInit(): void {
    this.appInfo$ = from((window as any).ipcRenderer.invoke('app:getInfo'));
  }

  logoutClicked() {
    this.store.dispatch(logout())
  }
}
