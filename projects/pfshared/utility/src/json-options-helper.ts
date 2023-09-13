export class JsonOptionsHelper<TOptions> {

  private options: TOptions;

  constructor(
    private readonly json: string,
    private readonly validate: (options: TOptions) => TOptions,
    private readonly changed: (json: string) => void
  ) {
    if (json) {
      try {
        this.options = JSON.parse(this.json);
      } catch (e) { }
    }
    this.options = this.validate(this.options);
  }

  getOption<K extends keyof TOptions>(key: K): TOptions[K] {
    return this.options[key];
  }

  setOption<K extends keyof TOptions>(key: K, value: TOptions[K]): void {
    this.options[key] = value;
    this.updateOptions();
  }

  private updateOptions() {
    this.changed(JSON.stringify(this.options));
  }
}