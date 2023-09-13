import { LoginType } from "./LoginType";

export interface LoginRequest {
  AccessToken?: string;
  AppVersion?: string;
  DealerCode: string;
  DeviceName?: string;
  DeviceToken?: string;
  LoginType: LoginType;
  Password?: string;
  Persist?: boolean;
  SourceApplication: string;
  UserName: string;
}