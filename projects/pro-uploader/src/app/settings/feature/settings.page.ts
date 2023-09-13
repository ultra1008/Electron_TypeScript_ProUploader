import { $pf, DealerService, ShowOrdersWithLocation } from 'pfshared/pfapi';
import { AppState } from '@app/shared/state/app.state';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  debounceTime,
  Subject,
  take,
  takeUntil
} from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { logout } from '@app/home/data-access/auth.actions';
import { NgxLoggerLevel } from 'ngx-logger';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
import { saveSettings } from '../data-access/settings.actions';
import { selectCurrentSettings } from '../data-access/settings.selectors';
import { Store } from '@ngrx/store';
import { bool } from 'aws-sdk/clients/signer';

@Component({
  selector: 'app-settings',
  template: `
    <section>
      <div class="settings-container">
        <h1 class="mb-5">{{'SETTINGS.TITLE' | translate}}</h1>

        <form [formGroup]="settingsForm" ngNativeValidate>
          <div class="card mb-4 general" formGroupName="general">
            <div class="card-header">{{'SETTINGS.GENERAL.HEADER' | translate}}</div>
            <div class="list-group list-group-flush">
              <label class="list-group-item form-switch" *ngIf="false">
                {{'SETTINGS.GENERAL.DARK_MODE' | translate}}
                <input type="checkbox" class="form-check-input float-end" checked formControlName="darkMode">
              </label>
              <label class="list-group-item">
                {{'SETTINGS.GENERAL.LANGUAGE' | translate}}
                <select class="form-select float-end w-50" formControlName="language">
                  <option *ngFor="let language of languages" value="{{language.value}}" selected>{{language.displayName}}</option>
                </select>
              </label>
              <label class="list-group-item">
                {{'SETTINGS.GENERAL.REFRESH_INTERVAL' | translate}}
                <input type="number" class="form-input float-end w-25" formControlName="refreshInterval">
              </label>
              <label class="list-group-item">
                {{'SETTINGS.GENERAL.MAX_AGE_DAYS' | translate}}
                <input type="number" class="form-input float-end w-25" formControlName="maxAgeDays">
              </label>
            </div>
          </div>

          <div class="card mb-4 uploading" formGroupName="uploading">
            <div class="card-header">{{'SETTINGS.UPLOADING.HEADER' | translate}}</div>
            <div class="list-group list-group-flush">
              <label class="list-group-item">
                {{'SETTINGS.UPLOADING.CONCURRENT_UPLOADS' | translate}}
                <input type="number" class="form-input float-end w-25" formControlName="concurrentUploads">
              </label>
              <label class="list-group-item">
                {{'SETTINGS.UPLOADING.ACCEPTS' | translate}}
                <input type="text" class="form-input float-end w-50" formControlName="accepts">
              </label>
              <label class="list-group-item form-switch">
                {{'SETTINGS.UPLOADING.MOCK_UPLOAD' | translate}}
                <input type="checkbox" class="form-check-input float-end" checked formControlName="mockUpload">
              </label>
            </div>
          </div>

          <div class="card mb-4 store-filter" formGroupName="storeFilter">
            <div class="card-header">{{'SETTINGS.STOREFILTER.HEADER' | translate}}</div>
            <div class="list-group list-group-flush">
              <div class="list-group-item">
                <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-0">{{'SETTINGS.STOREFILTER.ORDERS_WITHOUT_LOCATION' | translate}}</h6>
                </div>
              </div>
              <label class="list-group-item ms-3">
                <input type="checkbox" class="form-check-input me-2" formControlName="showOrdersWithoutLocation">
                {{'SETTINGS.STOREFILTER.SHOW_ORDERS_WITHOUT_LOCATION' | translate}}
              </label>
              <div class="list-group-item">
                <div class="d-flex w-100 justify-content-between">
                  <h6 class="mb-0">{{'SETTINGS.STOREFILTER.ORDERS_WITH_LOCATION' | translate}}</h6>
                </div>
              </div>
              <label class="list-group-item ms-3">
                <input type="radio" class="form-radio-input me-2" formControlName="showOrdersWithLocation" [value]="ShowOrdersWithLocation.IncludeAllStoreOrders">
                {{'SETTINGS.STOREFILTER.SHOW_ORDERS_FOR_ALL_LOCATIONS' | translate}}
              </label>
              <label class="list-group-item ms-3">
                <input type="radio" class="form-radio-input me-2" formControlName="showOrdersWithLocation" [value]="ShowOrdersWithLocation.IncludeOrdersWithLocations">
                {{'SETTINGS.STOREFILTER.SHOW_ORDERS_FOR_LOCATIONS' | translate}}
              </label>
              <div class="list-group-item ms-3">
                <div class="locations-container">
                  <label *ngFor="let store of stores$ | async">
                    <input type="checkbox" [(checklist)]="locations" [checklistValue]="store.Id" (checklistChange)="updateLocation($event)" [disabled]="!isShowOrdersWithLocation" />
                    {{store.Name}} <ng-container *ngIf="store.StoreNumber">({{store.StoreNumber}})</ng-container>
                  </label>
                </div>
              </div>
              <label class="list-group-item ms-3">
                <input type="radio" class="form-radio-input me-2" formControlName="showOrdersWithLocation" [value]="ShowOrdersWithLocation.ExcludeOrdersWithLocation">
                {{'SETTINGS.STOREFILTER.HIDE_ORDERS_WITH_LOCATION' | translate}}
              </label>
            </div>
          </div>

          <div class="card mb-4 logging" formGroupName="logging">
            <div class="card-header">{{'SETTINGS.LOGGING.HEADER' | translate}}</div>
            <div class="list-group list-group-flush">
              <label class="list-group-item">
                {{'SETTINGS.LOGGING.LOG_LEVEL' | translate}}
                <select class="form-select float-end w-50" formControlName="logLevel">
                  <option *ngFor="let logLevel of logLevels" value="{{logLevel.value}}">{{logLevel.displayName}}</option>
                </select>
              </label>
              <label class="list-group-item">
                {{'SETTINGS.LOGGING.SERVER_LOG_LEVEL' | translate}}
                <select class="form-select float-end w-50" formControlName="serverLogLevel">
                <option *ngFor="let logLevel of logLevels" value="{{logLevel.value}}">{{logLevel.displayName}}</option>
                </select>
              </label>
            </div>
          </div>

          <div class="actions d-flex justify-content-end mb-4">
            <button type="button" class="btn btn-lg btn-secondary" (click)="clearTemporaryStorageClicked()">{{'SETTINGS.CLEAR_TEMPORARY_STORAGE' | translate}}</button>
          </div>
        </form>
      </div>
    </section>
  `,
  styles: [`
    :host {
      height: 100vh;
      display: flex;
      padding: 40px 0;

      section {
        width: 100%;
      }

      .settings-container {
        max-width: 600px;
        margin: auto;

        .list-group-item {
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          align-items: center;
        }

        .store-filter {
          .list-group-item {
            border: none;
            display: flex;
            flex-wrap: nowrap;
            justify-content: start;
            align-items: center;
          }

          .locations-container {
            display: flex;
            flex-direction: column;
            margin-left: 1.5rem;
            overflow: auto;
            max-height: 113px;
            border: 1px white solid;
            padding: 10px;
            width: 100%;
          }
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPage implements OnInit, OnDestroy {
  constructor(
    private dealerService: DealerService,
    private fb: FormBuilder,
    private runtimeConfigLoader: RuntimeConfigLoaderService,
    private store: Store<AppState>
  ) {
    this.languages = this.runtimeConfigLoader.getConfigObjectKey("languages");

    this.store.select(selectCurrentSettings)
      .pipe(take(1))
      .subscribe(currentSettings => {
        this.settingsForm = this.fb.group({
          general: this.fb.group({
            darkMode: [currentSettings.general.darkMode],
            language: [currentSettings.general.language, [Validators.required]],
            maxAgeDays: [currentSettings.general.maxAgeDays, [Validators.required, Validators.min(0), Validators.max(30)]],
            refreshInterval: [currentSettings.general.refreshInterval, [Validators.required, Validators.min(1), Validators.max(10)]],
          }),
          logging: this.fb.group({
            logLevel: [currentSettings.logging.logLevel],
            serverLogLevel: [currentSettings.logging.serverLogLevel],
          }),
          storeFilter: this.fb.group({
            showOrdersWithoutLocation: [currentSettings.storeFilter.showOrdersWithoutLocation],
            showOrdersWithLocation: [currentSettings.storeFilter.showOrdersWithLocation],
            locations: [currentSettings.storeFilter.locations]
          }),
          uploading: this.fb.group({
            accepts: [currentSettings.uploading.accepts],
            concurrentUploads: [currentSettings.uploading.concurrentUploads, [Validators.required, Validators.min(1), Validators.max(3)]],
            mockUpload: [currentSettings.uploading.mockUpload],
          })
        });

        this.locations = currentSettings.storeFilter.locations;

        this.settingsForm.valueChanges
          .pipe(
            takeUntil(this.unsubscribe$$),
            debounceTime(500)
          )
          .subscribe(settings => {
            if (this.settingsForm.valid) {
              this.store.dispatch(saveSettings({ settings }))
            }
          });
      });
  }

  private storage: Storage = localStorage;
  private unsubscribe$$ = new Subject<void>();

  languages: { displayName: string, value: string }[];
  locations: number[] = [];
  logLevels: { displayName: string, value: NgxLoggerLevel }[] = [
    { displayName: "TRACE", value: NgxLoggerLevel.TRACE },
    { displayName: "DEBUG", value: NgxLoggerLevel.DEBUG },
    { displayName: "INFO", value: NgxLoggerLevel.INFO },
    { displayName: "LOG", value: NgxLoggerLevel.LOG },
    { displayName: "WARN", value: NgxLoggerLevel.WARN },
    { displayName: "ERROR", value: NgxLoggerLevel.ERROR },
    { displayName: "FATAL", value: NgxLoggerLevel.FATAL },
    { displayName: "OFF", value: NgxLoggerLevel.OFF }
  ];
  settingsForm: FormGroup;
  stores$ = this.dealerService.getDealerStores($pf.dealer.code);

  readonly ShowOrdersWithLocation = ShowOrdersWithLocation;

  get isShowOrdersWithLocation(): boolean {
    return this.settingsForm.get("storeFilter.showOrdersWithLocation").value == ShowOrdersWithLocation.IncludeOrdersWithLocations;
  }

  ngOnDestroy(): void {
    this.unsubscribe$$.next();
    this.unsubscribe$$.complete();
  }

  ngOnInit(): void {
  }

  clearTemporaryStorageClicked() {
    this.storage.clear();
    this.store.dispatch(logout())
  }

  updateLocation($event) {
    this.settingsForm.patchValue({ 
      storeFilter: {
        locations: $event
      }
    })
  }
}
