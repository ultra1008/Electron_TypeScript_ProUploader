import {
  Directive,
  Input,
  Renderer2,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  ComponentFactoryResolver,
  SimpleChange,
  OnChanges,
  ComponentRef,
  Injector,
  Inject,
  Optional,
} from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { IsBusyService } from "../is-busy.service";
import { IsBusySpinnerComponent } from "./is-busy-spinner.component";
import {
  IS_BUSY_DIRECTIVE_CONFIG,
  IsBusyDirectiveConfig,
} from "./is-busy.directive.config";

// This code was inspired by angular2-promise-buttons
// https://github.com/johannesjo/angular2-promise-buttons

@Directive({
  selector: "[isBusy]",
  exportAs: "isBusy",
})
export class IsBusyDirective implements OnChanges, AfterViewInit, OnDestroy {
  @Input()
  set isBusy(value: unknown) {
    if (typeof value === "string") {
      this.stringValue(value);
    } else {
      this.notStringValue();
    }

    if (value instanceof Subscription) {
      this.subscriptionValue(value);
    } else {
      this.notSubscriptionValue();
    }

    if (value instanceof Promise) {
      this.promiseValue(value);
    } else {
      this.notPromiseValue();
    }

    if (typeof value === "boolean") {
      this.booleanValue(value);
    } else {
      this.notBooleanValue();
    }

    if (value instanceof Observable) {
      this.observableValue();
    } else {
      this.notObservableValue();
    }
  }

  @Input() set isBusyDisableEl(value: boolean) {
    this._isBusyDisableEl = coerceBooleanValue(value);
  }
  get isBusyDisableEl() {
    return this._isBusyDisableEl;
  }

  // By default, if this directive is attached to an anchor or a button
  // element, add a `is-busy-spinner` element to the dom (for styling)
  @Input() set isBusySpinner(value: boolean) {
    this._isBusySpinner = coerceBooleanValue(value);
  }
  get isBusySpinner() {
    return this._isBusySpinner;
  }

  get isBusy() {
    return this._isBusy;
  }

  private _isBusy = false;

  private spinnerEl?: ComponentRef<IsBusySpinnerComponent>;

  private config: IsBusyDirectiveConfig;

  private _isBusyDisableEl: boolean;

  private _isBusySpinner: boolean;

  private busyClass: string;

  private set pending(value: Promise<unknown>) {
    this.startBusy();
    value.finally(() => this.stopBusy());
  }

  private textValueSubscription?: Subscription;
  private booleanValueResolveFn?: (value?: unknown) => void;

  constructor(
    @Optional()
    @Inject(IS_BUSY_DIRECTIVE_CONFIG)
    config: IsBusyDirectiveConfig | null,
    private renderer: Renderer2,
    private isBusyService: IsBusyService,
    private el: ElementRef<HTMLElement>,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {
    this.config = config || {};

    this._isBusyDisableEl =
      this.config.disableEl === undefined ? true : this.config.disableEl;

    this._isBusySpinner =
      this.config.addSpinnerEl !== undefined
        ? this.config.addSpinnerEl
        : this.el.nativeElement instanceof HTMLButtonElement ||
          this.el.nativeElement instanceof HTMLAnchorElement;

    this.busyClass = this.config.busyClass
      ? this.config.busyClass
      : "is-busy";
  }

  ngOnChanges(changes: {
    isBusySpinner?: SimpleChange;
    isBusyDisableEl?: SimpleChange;
  }) {
    if (
      changes.isBusySpinner &&
      !changes.isBusySpinner.isFirstChange() &&
      !changes.isBusySpinner.currentValue
    ) {
      this.removeSpinnerEl();
    }

    if (
      changes.isBusyDisableEl &&
      !changes.isBusyDisableEl.isFirstChange() &&
      !changes.isBusyDisableEl.currentValue
    ) {
      this.renderer.removeAttribute(this.el.nativeElement, "disabled");
    }
  }

  ngAfterViewInit() {
    if (this.isBusySpinner) {
      this.addSpinnerEl();
    }
  }

  ngOnDestroy() {
    if (this.textValueSubscription) {
      this.textValueSubscription.unsubscribe();
    }
  }

  private startBusy() {
    this.renderer.addClass(this.el.nativeElement, this.busyClass);
    if (this.isBusyDisableEl) {
      this.renderer.setAttribute(this.el.nativeElement, "disabled", "disabled");
    }
    this._isBusy = true;
  }

  private stopBusy() {
    this.renderer.removeClass(this.el.nativeElement, this.busyClass);
    if (this.isBusyDisableEl) {
      this.renderer.removeAttribute(this.el.nativeElement, "disabled");
    }
    this._isBusy = false;
  }

  private addSpinnerEl() {
    this.spinnerEl = this.componentFactoryResolver
      .resolveComponentFactory(IsBusySpinnerComponent)
      .create(this.injector);

    // need to use Renderer2#appendChild instead of
    // ViewContainerRef#createComponent because the injected
    // view container is not for the element this directive
    // is applied to
    this.renderer.appendChild(
      this.el.nativeElement,
      this.spinnerEl.instance.el.nativeElement
    );
  }

  private removeSpinnerEl() {
    if (!this.spinnerEl) return;

    this.renderer.removeChild(
      this.el.nativeElement,
      this.spinnerEl.instance.el.nativeElement
    );

    this.spinnerEl.destroy();
    this.spinnerEl = undefined;
  }

  /**
   * Input value handlers
   */

  private stringValue(value: string) {
    if (this.textValueSubscription) {
      this.textValueSubscription.unsubscribe();
    }

    this.textValueSubscription = this.isBusyService
      .isBusy$({
        key: value || "default",
      })
      .pipe(debounceTime(10), distinctUntilChanged())
      .subscribe((loading) => {
        if (loading) {
          this.startBusy();
        } else if (this.isBusy) {
          this.stopBusy();
        }
      });
  }

  private notStringValue() {
    if (this.textValueSubscription) {
      this.textValueSubscription.unsubscribe();
    }
  }

  private observableValue() {
    throw new TypeError(
      "Must be an instance of Subscription. Instance of Observable given."
    );
  }

  private notObservableValue() {}

  private subscriptionValue(value: Subscription) {
    //this.pending = new Promise<unknown>((resolve) => value.add(resolve));
  }

  private notSubscriptionValue() {}

  private promiseValue(value: Promise<unknown>) {
    this.pending = value;
  }

  private notPromiseValue() {}

  private booleanValue(value: boolean) {
    if (value) {
      this.pending = new Promise((resolve) => {
        this.booleanValueResolveFn = resolve;
      });
    } else if (this.booleanValueResolveFn) {
      this.booleanValueResolveFn();
    } else {
      this.stopBusy();
    }
  }

  private notBooleanValue() {
    if (this.booleanValueResolveFn) {
      this.booleanValueResolveFn();
    }
  }
}

function coerceBooleanValue(val: string | boolean) {
  if (typeof val === "boolean") return val;
  if (["", "true"].includes(val)) return true;
  return false;
}
