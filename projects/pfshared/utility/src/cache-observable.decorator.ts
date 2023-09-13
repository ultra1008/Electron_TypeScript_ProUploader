// https://gist.github.com/daxartio/5ebce9eac73d578615f3a8a8cf72a594

import { of as observableOf, Observable } from 'rxjs';
import { finalize, map, share } from 'rxjs/operators';

interface CacheOptions {
  withoutArgs?: boolean;
  caching?: boolean;
  expiration?: number;
}

interface CacheData {
  data;
  expiration?: number;
}

export function CacheObservable(options?: CacheOptions) {
  options = options || {};
  options.withoutArgs = options.withoutArgs || false;
  options.caching = options.caching || true;
  options.expiration = options.expiration || 0;

  const observableCache = new Map<string, Observable<any>>();
  const dataCache = new Map<string, CacheData>();

  return function (target, key: string, descriptor: PropertyDescriptor) {
    if (descriptor === undefined) {
      descriptor = Object.getOwnPropertyDescriptor(target, key);
    }
    const originalMethod = descriptor.value;
    descriptor.value = function () {
      let cacheKey = target.constructor.name + '.' + key;

      if (!options.withoutArgs) {
        const args = [];
        for (let _i = 0; _i < arguments.length; _i++) {
          args.push(arguments[_i]);
        }
        cacheKey += JSON.stringify(args);
      }

      const obs = observableCache.get(cacheKey);
      if (obs) {
        return obs;
      }

      if (options.caching) {
        const c = dataCache.get(cacheKey);
        if (c && (!options.expiration || Date.now() < c.expiration)) {
          return observableOf(c.data);
        }
        if (c && Date.now() >= c.expiration) {
          dataCache.delete(cacheKey);
        }
      }

      const result = originalMethod.apply(this, arguments).pipe(finalize(() => {
        observableCache.delete(cacheKey);
      })).pipe(map(res => {
        if (options.caching) {
          dataCache.set(cacheKey, {
            data: res,
            expiration: Date.now() + options.expiration
          });
        }
        return res;
      }), share());

      observableCache.set(cacheKey, result);

      return result;
    };

    return descriptor;
  };
}

/*
// https://medium.com/@cavaliere.davide/using-typescript-decorators-to-cache-observables-bc45404b4f3
import { Observable, race, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';

const d = console.log;

export interface CacheOptions {
  ttl?: number;
}

export function CacheObservable(options?: CacheOptions) {
  options = options || {};

  let lastCallArguments: any[] = [];

  return (target: any, propertyKey: string, descriptor) => {
    const originalFunction = descriptor.value;

    target[`${propertyKey}_cached`] = new ReplaySubject(1, options.ttl);

    descriptor.value = function(...args) {
      d('arguments are', args);

      // i'm not able to capture a defaulting that happens at function level
      // ie:
      // ```
      // @Cache(...)
      // public findAll(id: number = 1) { ... }
      // ```
      // if the function is called like`service.findAll();` then args would be [] but `originalFunction` will actually call the service with [1]
      // Is there a way to capture the defaulting mechanism?

      // args changed?
      let argsNotChanged = true;

      for (let i = 0; i < lastCallArguments.length; i++) {
        argsNotChanged = argsNotChanged && lastCallArguments[i] == args[i];
      }

      d('argsNotChanged', argsNotChanged);

      if (!argsNotChanged) { // args change
        this[`${propertyKey}_cached`] = new ReplaySubject(1, options.ttl);
      }

      lastCallArguments = args;

      const req: Observable<any> = originalFunction.apply(this, args).pipe(
        tap((response) => {
          this[`${propertyKey}_cached`].next(response);
        })
      );

      // despite what the documentation says i can't find that the complete is ever called
      return race(this[`${propertyKey}_cached`], req);

    };

    return descriptor;
  };
}
*/
