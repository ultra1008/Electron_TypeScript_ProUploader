import * as dot from 'ts-dot-prop';
import { $pf } from 'pfshared/pfapi';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppState, effects, reducers } from './shared/state/app.state';
import { BatchLoggerServerService, IBatchLoggerConfig } from './shared/data-access/BatchLoggerServerService';
import { BrowserModule } from '@angular/platform-browser';
import { combineLatest, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CustomRouterStateSerializer } from './shared/state/router-state-serializer';
import { EffectsModule } from '@ngrx/effects';
import { environment } from '../environments/environment';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { loadSettings } from './settings/data-access/settings.actions';
import {
  LoggerModule,
  NGXLogger,
  NgxLoggerLevel,
  TOKEN_LOGGER_SERVER_SERVICE
  } from 'ngx-logger';
import { NgbModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxFileDropModule } from 'ngx-file-drop';
import { PFApiModule } from './shared/data-access/pfapi.module';
import { PhotoCountPipe } from './orders/ui/photo-count.pipe';
import { RouterModule } from '@angular/router';
import { RuntimeConfigLoaderModule, RuntimeConfigLoaderService } from 'runtime-config-loader';
import { selectCurrentSettings } from './settings/data-access/settings.selectors';
import { SidebarModule } from './shared/ui/sidebar/sidebar.component';
import { Store, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { ToastsModule } from './shared/ui/toast/toasts.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

// AoT requires an exported function for factories
const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader => new TranslateHttpLoader(http, './assets/i18n/', '.json');

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG
    }, {
      serverProvider: { provide: TOKEN_LOGGER_SERVER_SERVICE, useClass: BatchLoggerServerService }
    }),
    NgbModule,
    NgbProgressbarModule,
    NgxFileDropModule,
    RouterModule,
    RuntimeConfigLoaderModule.forRoot({
      configUrl: environment.configUrl
    }),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(effects),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: true
    }),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomRouterStateSerializer
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }),

    AppRoutingModule,
    PFApiModule,
    SidebarModule,
    ToastsModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [
        NGXLogger,
        RuntimeConfigLoaderService,
        Store<AppState>
      ],
      multi: true
    },
    PhotoCountPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() { }
}

function initializeApp(
  logger: NGXLogger,
  runtimeConfigLoader: RuntimeConfigLoaderService,
  store: Store<AppState>
) {
  return (): Promise<void> => {
    return new Promise((resolve, reject) => {
      store.dispatch(loadSettings());

      combineLatest([
        runtimeConfigLoader.configSubject,
        store.select(selectCurrentSettings)
      ]).pipe(take(1)).subscribe(([config, settings]) => {
        // setup $pf with default values
        $pf.appId = "PRO Uploader";
        $pf.apiKey = "JUgUwrasep3BrusaG6Ch";
        $pf.user.authKey = "JUgUwrasep3BrusaG6Ch";
        $pf.user.authSecret = "broUzLu9HiupiE2lAyoa7TOatouH6uFR";
        $pf.user.isAuthenticated = false;

        // setup $pf with config values
        var keys = Object.keys(config).filter(k => k.startsWith("pf."));
        keys.forEach(key => {
          dot.set($pf, key.replace("pf.", ""), config[key]);
        });

        // pick a random apiUrl and remove any trailing "/"
        var apiUrls = config.apiUrls;
        var index = Math.floor(Math.random() * apiUrls.length)
        $pf.apiUrl = apiUrls[index].replace(/\/+$/g, "");

        // setup logging configuration
        var loggerConfig = logger.getConfigSnapshot() as IBatchLoggerConfig;
        loggerConfig.level = settings.logging.logLevel;

        if (settings.logging.serverLogLevel != NgxLoggerLevel.OFF) {
          loggerConfig.serverLogLevel = settings.logging.serverLogLevel;
          loggerConfig.serverLoggingUrl = `${$pf.apiUrl}/logger-batch`;
          loggerConfig.serverLoggingBufferCount = 5;
          loggerConfig.serverLoggingBufferTime = 10;
        }

        logger.updateConfig(loggerConfig);

        resolve();
      });
    });
  }
}
