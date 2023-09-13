﻿export enum ApiErrorCodes {
  None = 0,
  InvalidApiKey = 1,
  ApiKeyAuthorization = 2,
  InvalidUserAuthorizationKey = 50,
  InvalidRequestHeader = 51,
  InvalidUriScheme = 52,
  InvalidToken = 53,
  InvalidScheme = 54,
  InvalidMD5 = 55,
  InvalidSignature = 56,
  InvalidTimestamp = 57,
  InvalidParameter = 58,
  InvalidRole = 59,
  AuthenticationFailed = 60,
  InternalServerError = 100,
  NotFound = 101,
  InvalidId = 102,
  InvalidKey = 103,
  InvalidName = 104,
  InvalidData = 107,
  UnauthorizedAccess = 108,
  InvalidOperation = 109,
  InvalidProgramException = 110,
  MissingRequiredParameter = 111,
  MissingRequiredType = 112,
  InvalidUserCredentials = 1000,
  UserAccountExpired = 1001,
  InvalidDealerCode = 1002,
  UserMembershipDisabledOrDeleted = 1003,
  InvalidFacebookUserCredentials = 1004,
  InvalidDealerCodeOrId = 2000,
  AccountExists = 5000,
  NicknameExists = 5001,
  OldPasswordInvalid = 5002,
  NewPasswordInvalid = 5003,
  UsernameExists = 5004,
  OrderSubmitError = 5500,
  PaymentAuthorizationError = 5501,
  PaymentMethodError = 5502,
  InvalidCoupon = 5503,
  InvalidStoredValueCard = 5504,
  InvalidPhoneNumber = 5505,
  UnsupportedPhoneNumber = 5506,
  InvalidCaptcha = 5507,
  CaptchaRequired = 5508,
  UnsupportedFormat = 6000,
  InvalidChunkNumber = 6001,
  InvalidTotalChunks = 6002,
  ClaimCodeInvalid = 7000,
  ClaimCodeExpired = 7001
}