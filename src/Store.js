export class Store {
  #items = new Map();

  static isValidItem(item) {
    return (
      item !== null &&
      typeof item === 'object' &&
      'id' in item &&
      item.id !== null &&
      item.id !== undefined
    );
  }

  add(item) {
    if (!Store.isValidItem(item)) {
      throw new TypeError('item must be an object with a non-null id');
    }
    if (this.#items.has(item.id)) {
      throw new RangeError(`An item with id "${String(item.id)}" already exists`);
    }

    this.#items.set(item.id, item);
    return item;
  }

  remove(id) {
    return this.#items.delete(id);
  }

  find(id) {
    return this.#items.get(id);
  }

  total() {
    return this.#items.size;
  }

  get size() {
    return this.#items.size;
  }

  getAll() {
    return [...this.#items.values()];
  }
}

export class SortedStore extends Store {
  constructor(sortBy = 'id') {
    super();
    if (typeof sortBy !== 'string' || sortBy.length === 0) {
      throw new TypeError('sortBy must be a non-empty string');
    }
    this.sortBy = sortBy;
  }

  getAll() {
    return super.getAll().sort((first, second) => {
      const firstValue = first[this.sortBy];
      const secondValue = second[this.sortBy];

      if (firstValue < secondValue) {
        return -1;
      }
      if (firstValue > secondValue) {
        return 1;
      }
      return 0;
    });
  }
}
