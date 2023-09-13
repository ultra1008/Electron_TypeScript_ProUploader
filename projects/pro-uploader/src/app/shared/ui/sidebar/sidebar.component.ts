import { AppState } from '@app/shared/state/app.state';
import { logout } from '@app/home/data-access/auth.actions';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isAuthenticated } from '@app/home/data-access/auth.selectors';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-sidebar',
  template: `
    <a [routerLink]="['/home']" class="d-block p-3 link-light text-decoration-none">
      <img width="40" alt="PRO Uploader" src="data:image/png;base64,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">
    </a>
    <ul class="nav nav-pills nav-flush flex-column mb-auto text-center">
      <li class="nav-item">
        <a [routerLink]="['/home']" [routerLinkActive]="['active']" class="nav-link py-3 px-0 border-bottom rounded-0" ngbTooltip="Home" placement="end">
          <i class="fa-solid fa-house-chimney fa-xl"></i>
        </a>
      </li>
      <li class="nav-item">
        <a [routerLink]="['/orders']" [routerLinkActive]="['active']" class="nav-link py-3 px-0 border-bottom rounded-0" ngbTooltip="Orders" placement="end">
          <i class="fa-solid fa-table fa-xl"></i>
        </a>
      </li>
      <li class="nav-item">
        <a [routerLink]="['/uploads']" [routerLinkActive]="['active']" class="nav-link py-3 px-0 border-bottom rounded-0" ngbTooltip="Uploads" placement="end">
          <i class="fa-solid fa-upload fa-xl"></i>
        </a>
      </li>
      <li class="nav-item">
        <a [routerLink]="['/settings']" [routerLinkActive]="['active']" class="nav-link py-3 px-0 border-bottom rounded-0" ngbTooltip="Settings" placement="end">
          <i class="fa-solid fa-gear fa-xl"></i>
        </a>
      </li>
    </ul>
    <div ngbDropdown class="border-top" *ngIf="isAuthenticated$ | async">
      <a class="d-flex align-items-center justify-content-center p-3 link-light text-decoration-none" id="dropdownUser3" ngbDropdownToggle>
        <i class="fa-solid fa-user fa-xl"></i>
      </a>
      <div ngbDropdownMenu class="text-small shadow" aria-labelledby="dropdownUser3">
        <a ngbDropdownItem [routerLink]="['/orders', 0]">New Upload Order...</a>
        <a ngbDropdownItem [routerLink]="['/settings']">Settings</a>
        <hr class="dropdown-divider">
        <a ngbDropdownItem (click)="logout()">Log out</a>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      align-content: stretch;
      gap: 10px;
      height: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {

  constructor(private store: Store<AppState>) {}

  isAuthenticated$: Observable<boolean>;
  
  ngOnInit(): void {
    this.isAuthenticated$ = this.store.select(isAuthenticated);
  }

  logout(): void {
    this.store.dispatch(logout())
  }
}

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    RouterModule
  ],
  declarations: [SidebarComponent],
  exports: [SidebarComponent],
})
export class SidebarModule { }

