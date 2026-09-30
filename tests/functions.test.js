import { describe, expect, it, vi } from 'vitest';
import { chunk, counter, deepClone, groupBy, memoize, unique } from '../src/functions.js';

describe('unique', () => {
  it('returns a copy of an array containing unique values in order', () => {
    const input = [3, 1, 3, 2, 1];
    expect(unique(input)).toEqual([3, 1, 2]);
    expect(unique(input)).not.toBe(input);
    expect(input).toEqual([3, 1, 3, 2, 1]);
  });

  it('returns an empty array for empty input', () => {
    expect(unique([])).toEqual([]);
  });

  it('throws for a non-array input', () => {
    expect(() => unique(null)).toThrow(TypeError);
  });
});

describe('groupBy', () => {
  it('groups items by a computed key without changing the input', () => {
    const items = [{ type: 'fruit', name: 'apple' }, { type: 'vegetable', name: 'carrot' }, { type: 'fruit', name: 'pear' }];
    const result = groupBy(items, ({ type }) => type);

    expect(result).toEqual({
      fruit: [items[0], items[2]],
      vegetable: [items[1]],
    });
    expect(items).toHaveLength(3);
  });

  it('returns an empty object for an empty array', () => {
    expect(groupBy([], (item) => item)).toEqual({});
  });

  it('safely supports special object property names', () => {
    const result = groupBy(['value'], () => '__proto__');

    expect(Object.keys(result)).toContain('__proto__');
    expect(result['__proto__']).toEqual(['value']);
  });

  it('throws for an invalid array or key function', () => {
    expect(() => groupBy({}, (item) => item)).toThrow(TypeError);
    expect(() => groupBy([], null)).toThrow(TypeError);
  });
});

describe('chunk', () => {
  it('splits an array into chunks and allows a shorter final chunk', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('returns an empty array for empty input', () => {
    expect(chunk([], 3)).toEqual([]);
  });

  it('throws for zero, negative, fractional, and non-numeric sizes', () => {
    expect(() => chunk([1], 0)).toThrow(RangeError);
    expect(() => chunk([1], -2)).toThrow(RangeError);
    expect(() => chunk([1], 1.5)).toThrow(TypeError);
    expect(() => chunk([1], '2')).toThrow(TypeError);
  });

  it('throws for a non-array input', () => {
    expect(() => chunk('items', 2)).toThrow(TypeError);
  });
});

describe('deepClone', () => {
  it('deeply clones nested objects and arrays independently', () => {
    const original = { nested: { values: [1, { score: 2 }] } };
    const copy = deepClone(original);

    expect(copy).toEqual(original);
    expect(copy).not.toBe(original);
    expect(copy.nested).not.toBe(original.nested);
    expect(copy.nested.values).not.toBe(original.nested.values);
    copy.nested.values[1].score = 10;
    expect(original.nested.values[1].score).toBe(2);
  });

  it('handles null and primitive values', () => {
    expect(deepClone(null)).toBeNull();
    expect(deepClone(0)).toBe(0);
    expect(deepClone('text')).toBe('text');
  });

  it('preserves circular references and shared references', () => {
    const shared = { value: 1 };
    const original = { first: shared, second: shared };
    original.self = original;

    const copy = deepClone(original);

    expect(copy.self).toBe(copy);
    expect(copy.first).toBe(copy.second);
    expect(copy.first).not.toBe(shared);
  });
});

describe('memoize', () => {
  it('caches results for repeated primitive arguments', () => {
    const calculation = vi.fn((first, second) => first + second);
    const memoized = memoize(calculation);

    expect(memoized(2, 3)).toBe(5);
    expect(memoized(2, 3)).toBe(5);
    expect(calculation).toHaveBeenCalledTimes(1);
  });

  it('supports different argument counts, object identities, and undefined results', () => {
    const calculation = vi.fn((...args) => args.length);
    const memoized = memoize(calculation);
    const objectArg = {};

    expect(memoized()).toBe(0);
    expect(memoized(undefined)).toBe(1);
    expect(memoized(objectArg)).toBe(1);
    expect(memoized(objectArg)).toBe(1);
    expect(calculation).toHaveBeenCalledTimes(3);
  });

  it('throws when the input is not a function', () => {
    expect(() => memoize(42)).toThrow(TypeError);
  });
});

describe('counter', () => {
  it('increments, decrements, and returns its current value', () => {
    const result = counter();

    expect(result.value()).toBe(0);
    expect(result.inc()).toBe(1);
    expect(result.inc()).toBe(2);
    expect(result.dec()).toBe(1);
    expect(result.value()).toBe(1);
  });

  it('keeps separate counters independent and permits negative values', () => {
    const first = counter();
    const second = counter();

    first.dec();
    expect(first.value()).toBe(-1);
    expect(second.value()).toBe(0);
  });
});
