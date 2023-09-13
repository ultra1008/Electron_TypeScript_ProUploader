import { AppState } from './shared/state/app.state';
import { autoLogin } from './home/data-access/auth.actions';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ElectronService } from './shared/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { loadSettings } from './settings/data-access/settings.actions';

@Component({
  selector: 'app-root',
  template: `
    <div class="sidebar bg-dark">
      <app-sidebar></app-sidebar>
    </div>

    <div class="views">
      <router-outlet></router-outlet>
      <app-toasts aria-live="polite" aria-atomic="true"></app-toasts>
    </div>
  `,
  styles: [`
    :host {
      height: 100vh;
      display: grid;
      grid-template-columns: 72px 1fr;
      justify-items: stretch;

      .sidebar {
        grid-column: 1;
        grid-row: 1;
      }

      .views {
        grid-column: 2;
        grid-row: 1;
      }
    }
  `]
})
export class AppComponent implements OnInit {

  constructor(
    private electronService: ElectronService,
    private store: Store<AppState>,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }
  }

  ngOnInit(): void {
    this.store.dispatch(autoLogin());
    this.store.dispatch(loadSettings());
  }
}
