import { InjectionToken } from '@angular/core';

export const IS_BUSY_DIRECTIVE_CONFIG = new InjectionToken(
  'IS_BUSY_DIRECTIVE_CONFIG',
);

/**
 * Config object for IsBusyDirective
 * 
 * @param disableEl disable element while busy?
 * @param busyClass the class used to indicate busy
 * @param addSpinnerEl should a spinner element be added to the dom?
 */
export interface IsBusyDirectiveConfig {
  // disable element while busy
  disableEl?: boolean;
  // the class used to indicate busy
  busyClass?: string;
  // should a spinner element be added to the dom
  addSpinnerEl?: boolean;
}
