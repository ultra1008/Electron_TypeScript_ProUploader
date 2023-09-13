export interface ICancelablePromise<T> {
  promise: Promise<T>;
  cancel: () => void;
  canceled: () => boolean;
}

export function makeCancelable<T>(promise): ICancelablePromise<T> {
  let isCanceled = false;
  let cancel = () => {
    isCanceled = true;
  };
  let canceled = (): boolean => {
    return isCanceled;
  };

  const wrappedPromise = new Promise<T>((resolve, reject) => {
    promise.then((val) => {
      return isCanceled ? reject({ isCanceled: true }) : resolve(val)
    });

    promise.catch((error) => {
      return isCanceled ? reject({ isCanceled: true }) : reject(error);
    });

    // When consumer calls `cancel`:
    cancel = () => {
      // In case the promise has already resolved/rejected, don't run cancel behavior!
      if (isCanceled) {
        return;
      }

      isCanceled = true;

      // Cancel-path scenario
      reject({ isCanceled: true });
    };

    // If was cancelled before promise was launched, trigger cancel logic
    if (isCanceled) {
      cancel();
    }
  });

  return { promise: wrappedPromise, cancel, canceled };
}
