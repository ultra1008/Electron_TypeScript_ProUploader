export class CountDownTimer {
  private duration: number;
  private granularity: number;
  private running: boolean = false;
  private tickFuncs = [];
  private timeoutHandle: number;

  constructor(duration: number, granularity: number = 1000) {
    this.duration = duration;
    this.granularity = granularity;
  }
  
  get expired(): boolean {
    return !this.running;
  }

  restart(duration: number, granularity: number = 1000) {
    this.stop();

    this.duration = duration;
    this.granularity = granularity;

    this.start();
  }

  start() {
    if (this.running) {
      return;
    }

    this.running = true;

    let start = Date.now();

    const timer = () => {
      if (!this.running) {
        return;
      }

      let diff = this.duration - (((Date.now() - start) / 1000) | 0);

      if (diff > 0) {
        this.timeoutHandle = window.setTimeout(timer, this.granularity);
      } else {
        diff = 0;
        this.running = false;
      }

      let obj = CountDownTimer.parse(diff);
      this.tickFuncs.forEach((func) => {
        func.call(this, obj.minutes, obj.seconds);
      });
    };

    timer();
  }

  stop() {
    this.running = false;
    window.clearTimeout(this.timeoutHandle);
  }

  onTick(func): CountDownTimer {
    if (typeof func === "function") {
      this.tickFuncs.push(func);
    }

    return this;
  }

  static parse(seconds) {
    return {
      "minutes": (seconds / 60) | 0,
      "seconds": (seconds % 60) | 0
    };
  }
}
