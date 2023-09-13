export class Backoff {
  private readonly options = {
    wait: 1000,
    factor: 2,
    jitter: 1,
    attempts: 0,
    maxAttempts: 5
  };

  constructor(options?) {
    this.options = Object.assign({}, this.options, options);
  }

  run(cb) {
    var delay = this.getDelay(this.options.attempts);
    var retry = () => {
      if (this.options.attempts > this.options.maxAttempts) {
        return false;
      }

      setTimeout(() => {
        delay = this.getDelay(this.options.attempts++);
        cb(retry);
      }, delay);

      return true;
    };

    return retry();
  }

  private getDelay(attempt) {
    let delay = this.options.wait * Math.pow(this.options.factor, attempt);
    if (delay > 0 && this.options.jitter) {
      delay += Math.random() * this.options.jitter;
    }
    return delay;
  }
}