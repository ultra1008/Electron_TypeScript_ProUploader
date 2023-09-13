import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { from, of, switchMap, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { loadSettings, loadSettingsFailure, loadSettingsSuccess, saveSettings, saveSettingsFailure, saveSettingsSuccess } from './settings.actions';
import { SettingsService } from './settings.service';

@Injectable()
export class AppSettingsEffects {
  constructor(
    private actions$: Actions,
    private settingsService: SettingsService
  ) { }

  loadSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSettings),
      exhaustMap((action) =>
        from(this.settingsService.getSettings()).pipe(
          // Return a new success action
          map((settings) => {
            return loadSettingsSuccess({ settings });
          }),
          // Or... if it errors return a new failure action containing the error
          catchError((error) => of(loadSettingsFailure({ error })))
        ))
    )
  );

  saveSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveSettings),
      switchMap((action) =>
        from(this.settingsService.saveSettings(action.settings)).pipe(
          map((settings) => {
            return saveSettingsSuccess({ settings });
          }),
          catchError((error) => of(saveSettingsFailure({ error })))
        )
      )
    )
  );
}
