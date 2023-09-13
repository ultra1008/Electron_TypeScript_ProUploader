import { AppState } from '@app/shared/state/app.state';
import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IsBusyModule, IsBusyService } from 'pfshared/is-busy';
import { login } from '@app/home/data-access/auth.actions';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-login-form',
  encapsulation: ViewEncapsulation.None,
  template: `
  <form [formGroup]="form" (ngSubmit)="handleLogin()" ngNativeValidate>
    <h1 class="h3 mb-3 fw-normal">Please log in</h1>

    <div class="form-floating mb-3">
      <input type="text" class="form-control" formControlName="dealerCode" placeholder="Dealer Code" autocomplete="off">
      <label for="dealerCode">Dealer code</label>
    </div>
    <div class="form-floating mb-3">
      <input type="text" class="form-control" formControlName="username" placeholder="User Name" autocomplete="off">
      <label for="username">User name</label>
    </div>
    <div class="form-floating mb-3">
      <input type="password" class="form-control" formControlName="password" placeholder="Password" autocomplete="off">
      <label for="password">Password</label>
    </div>

    <div class="checkbox mb-3">
      <label>
        <input type="checkbox" value="remember-me" formControlName="rememberMe"> Remember me
      </label>
    </div>
    <button class="w-100 btn btn-lg btn-primary" type="submit" isBusy='login'>Log in</button>
  </form>
  `,
  styles: []
})
export class LoginFormComponent implements OnInit {
  constructor(
    private busyService: IsBusyService,
    private fb: FormBuilder,
    private store: Store<AppState>
  ) { }

  form: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      dealerCode: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  handleLogin() {
    if (!this.busyService.isBusy({ key: 'login' })) {
      this.store.dispatch(login({ credentials: this.form.value }));
    }
  }
}

@NgModule({
  imports: [
    CommonModule,
    IsBusyModule,
    ReactiveFormsModule
  ],
  declarations: [LoginFormComponent],
  exports: [LoginFormComponent]
})
export class LoginFormModule { }
