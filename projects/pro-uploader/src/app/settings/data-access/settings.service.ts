import { Injectable } from "@angular/core";
import { NgxLoggerLevel } from "ngx-logger";
import { ShowOrdersWithLocation } from "pfshared/pfapi";
import { AppSettings } from "./settings.model";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor() { }

  private storage: Storage = localStorage;
  private readonly version = 1;

  static defaults: AppSettings = {
    general: {
      darkMode: true,
      language: "en",
      maxAgeDays: 2,
      refreshInterval: 5
    },
    logging: {
      logLevel: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.OFF,
    },
    storeFilter: {
      showOrdersWithoutLocation: true,
      showOrdersWithLocation: ShowOrdersWithLocation.IncludeAllStoreOrders,
      locations: []
      },
    uploading: {
      accepts: "image/*",
      concurrentUploads: 3,
      mockUpload: false
    }
  };

  getSettings(): Promise<AppSettings> {
    return new Promise<AppSettings>((resolve, reject) => {
      const json = this.storage.getItem('settings');
      if (json) {
        try {
          let settings = JSON.parse(json);
          if (settings.version == this.version) {
            return resolve({
              ...SettingsService.defaults,
              ...settings.data
            });
          }
        } catch (e) { }
      }
      return resolve(SettingsService.defaults);
    });
  }

  saveSettings(settings: Partial<AppSettings>): Promise<Partial<AppSettings>> {
    return new Promise((resolve) => {
      this.storage.setItem('settings', JSON.stringify({
        version: this.version,
        data: {
          ...SettingsService.defaults,
          ...settings
        }
      }));
      return resolve(this.getSettings());
    });
  }
}