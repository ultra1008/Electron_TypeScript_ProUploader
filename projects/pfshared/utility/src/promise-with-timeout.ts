export function promiseWithTimeout<T>(timeoutMs: number, promise: () => Promise<T>, failureMessage?: string) {
  let timeoutHandle;
  const timeoutPromise = new Promise<never>((resolve, reject) => {
    timeoutHandle = setTimeout(() => reject(new Error(failureMessage)), timeoutMs);
  });

  return Promise.race([promise(), timeoutPromise,]).then((result) => {
    clearTimeout(timeoutHandle);
    return result;
  });
}