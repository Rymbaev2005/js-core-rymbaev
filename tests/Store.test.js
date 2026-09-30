import { describe, expect, it } from 'vitest';
import { SortedStore, Store } from '../src/Store.js';

describe('Store', () => {
  it('adds items and exposes the count through total and the size getter', () => {
    const store = new Store();
    const item = { id: 1, name: 'Notebook' };

    expect(store.add(item)).toBe(item);
    expect(store.total()).toBe(1);
    expect(store.size).toBe(1);
  });

  it('removes an existing item and returns false for a missing id', () => {
    const store = new Store();
    store.add({ id: 1 });

    expect(store.remove(1)).toBe(true);
    expect(store.remove(1)).toBe(false);
    expect(store.total()).toBe(0);
  });

  it('finds an item and returns undefined when it is absent', () => {
    const store = new Store();
    const item = { id: 0, name: 'Zero ID' };
    store.add(item);

    expect(store.find(0)).toBe(item);
    expect(store.find(99)).toBeUndefined();
  });

  it('rejects invalid items and duplicate identifiers', () => {
    const store = new Store();

    expect(() => store.add(null)).toThrow(TypeError);
    expect(() => store.add({ name: 'Missing id' })).toThrow(TypeError);
    expect(() => store.add({ id: null })).toThrow(TypeError);
    store.add({ id: 1 });
    expect(() => store.add({ id: 1 })).toThrow(RangeError);
  });

  it('provides a static item validator and does not expose its private map', () => {
    const store = new Store();

    expect(Store.isValidItem({ id: 0 })).toBe(true);
    expect(Store.isValidItem({})).toBe(false);
    expect(Object.keys(store)).toEqual([]);
    expect(store.items).toBeUndefined();
  });
});

describe('SortedStore', () => {
  it('returns items sorted by the selected field', () => {
    const store = new SortedStore('name');
    store.add({ id: 1, name: 'Pear' });
    store.add({ id: 2, name: 'Apple' });
    store.add({ id: 3, name: 'Orange' });

    expect(store.getAll().map(({ name }) => name)).toEqual(['Apple', 'Orange', 'Pear']);
  });

  it('inherits add, find, remove, and count behavior from Store', () => {
    const store = new SortedStore('rank');
    const item = { id: 1, rank: 2 };

    store.add(item);
    expect(store.find(1)).toBe(item);
    expect(store.total()).toBe(1);
    expect(store.remove(1)).toBe(true);
    expect(store.total()).toBe(0);
  });

  it('is a Store subclass and rejects an invalid sort field', () => {
    const store = new SortedStore();

    expect(store).toBeInstanceOf(Store);
    expect(store).toBeInstanceOf(SortedStore);
    expect(() => new SortedStore('')).toThrow(TypeError);
    expect(() => new SortedStore(2)).toThrow(TypeError);
  });
});
