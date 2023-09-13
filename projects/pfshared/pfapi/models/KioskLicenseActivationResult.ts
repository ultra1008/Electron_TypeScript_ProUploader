




export const enum KioskLicenseActivationResult {
    Success = 1,
    KioskUnkown = 2,
    NoLicense = 3,
    LicenseInUse = 4,
    ValidationFailed = 5,
    TokenInvalid = 6,
    ConnectionProblem = 7,
    VersionOutOfDate = 8,
    SessionLicenseInUse = 9,
    SessionMismatch = 10,
    SessionMachineKeyNull = 11,
    SessionMissingActivationRecord = 12,
    HardwareIdUnavailable = 13
}

