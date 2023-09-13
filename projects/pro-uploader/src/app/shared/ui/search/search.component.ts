import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  template: `
    <form [formGroup]="form">
      <div class="input-group">
        <input type="text" class="form-control" placeholder="{{placeholder}}" formControlName="search">
        <button type="button" class="btn btn-outline-secondary" (click)="clearSearch()">
          <span *ngIf="hasSearch()">
            <i class="fa-solid fa-xmark"></i>
          </span>
          <span *ngIf="!hasSearch()">
            <i class="fa-solid fa-magnifying-glass"></i>
          </span>
        </button>
      </div>
    </form>
  `,
  styles: [`
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
  ) { }

  @Input() placeholder: string;

  @Input()
  set search(search: string) {
    this.form.setValue({ search }, { emitEvent: false });
  }

  @Output() searchChanged: EventEmitter<string> = new EventEmitter();

  form: FormGroup = this.fb.group({ search: [''] });

  private unsubscribe$ = new Subject<void>();

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    // Debounce the text input
    this.form
      .get('search')
      .valueChanges.pipe(takeUntil(this.unsubscribe$), debounceTime(350))
      .subscribe((value) => {
        this.searchChanged.emit({
          ...this.form.value,
          search: value,
        });
      });
  }

  clearSearch() {
    this.form.setValue({ search: "" });
  }

  hasSearch(): boolean {
    return this.form.value.search.length;
  }
}

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule
  ],
  declarations: [SearchComponent],
  exports: [SearchComponent],
})
export class SearchModule { }

