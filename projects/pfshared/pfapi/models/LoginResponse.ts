import { LoginType } from "./LoginType";

export interface LoginResponse {
  AuthorizationKey: string;
  DealerCode: string;
  DealerId: number;
  Error: string;
  LoginType: LoginType;
  RecommendedUrl: string;
  RequirePasswordUpdate: boolean;
  SecretKey: string;
  UserId: number;
  UserName: string;
}