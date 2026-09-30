export const unique = (arr) => {
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an array');
  }

  const seen = new Set();
  return arr.filter((item) => {
    if (seen.has(item)) {
      return false;
    }
    seen.add(item);
    return true;
  });
};

export const groupBy = (arr, keyFn) => {
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an array');
  }
  if (typeof keyFn !== 'function') {
    throw new TypeError('keyFn must be a function');
  }

  return arr.reduce((groups, item) => {
    const key = keyFn(item);

    if (!Object.prototype.hasOwnProperty.call(groups, key)) {
      Object.defineProperty(groups, key, {
        value: [],
        enumerable: true,
        configurable: true,
        writable: true,
      });
    }

    groups[key].push(item);
    return groups;
  }, {});
};

export const chunk = (arr, size) => {
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be an array');
  }
  if (!Number.isInteger(size)) {
    throw new TypeError('size must be an integer');
  }
  if (size <= 0) {
    throw new RangeError('size must be greater than zero');
  }

  return Array.from({ length: Math.ceil(arr.length / size) })
    .map((_, index) => arr.slice(index * size, (index + 1) * size));
};

export const deepClone = (obj) => {
  const clones = new WeakMap();

  const clone = (value) => {
    if (value === null || typeof value !== 'object') {
      return value;
    }
    if (clones.has(value)) {
      return clones.get(value);
    }

    if (value instanceof Date) {
      const dateClone = new Date(value.getTime());
      clones.set(value, dateClone);
      return dateClone;
    }
    if (value instanceof RegExp) {
      const regexpClone = new RegExp(value.source, value.flags);
      regexpClone.lastIndex = value.lastIndex;
      clones.set(value, regexpClone);
      return regexpClone;
    }
    if (value instanceof Map) {
      const mapClone = new Map();
      clones.set(value, mapClone);
      value.forEach((entryValue, entryKey) => {
        mapClone.set(clone(entryKey), clone(entryValue));
      });
      return mapClone;
    }
    if (value instanceof Set) {
      const setClone = new Set();
      clones.set(value, setClone);
      value.forEach((entryValue) => setClone.add(clone(entryValue)));
      return setClone;
    }

    const objectClone = Array.isArray(value)
      ? []
      : Object.create(Object.getPrototypeOf(value));
    clones.set(value, objectClone);

    Reflect.ownKeys(value).forEach((key) => {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (Object.prototype.hasOwnProperty.call(descriptor, 'value')) {
        descriptor.value = clone(descriptor.value);
      }
      Object.defineProperty(objectClone, key, descriptor);
    });

    return objectClone;
  };

  return clone(obj);
};

export const memoize = (fn) => {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  const cache = new Map();
  const resultKey = Symbol('memoized result');

  return function memoized(...args) {
    let current = cache;
    const keys = [this, ...args];

    keys.forEach((key) => {
      if (!current.has(key)) {
        current.set(key, new Map());
      }
      current = current.get(key);
    });

    if (current.has(resultKey)) {
      return current.get(resultKey);
    }

    const result = fn.apply(this, args);
    current.set(resultKey, result);
    return result;
  };
};

export const counter = () => {
  let count = 0;

  return {
    inc: () => ++count,
    dec: () => --count,
    value: () => count,
  };
};
