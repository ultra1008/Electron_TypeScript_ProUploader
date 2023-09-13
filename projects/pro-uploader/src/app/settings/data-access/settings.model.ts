import { ShowOrdersWithLocation } from "pfshared/pfapi";

export interface AppSettings {
  general: {
    darkMode: boolean;
    language: string;
    maxAgeDays: number;
    refreshInterval: number;
  },
  logging: {
    logLevel: number;
    serverLogLevel: number;
  },
  storeFilter: {
    showOrdersWithoutLocation: boolean;
    showOrdersWithLocation: ShowOrdersWithLocation;
    locations: number[];
  },
  uploading: {
    accepts: string;
    concurrentUploads: number;
    mockUpload: boolean;
  }
}

export type AppSettingsStatus = 'pending' | 'success' | 'error';
