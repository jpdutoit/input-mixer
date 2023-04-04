export class DefaultMap<Key, Value> extends Map<Key, Value> {
  constructor(public defaultConstructor: (key: Key) => Value) {
    super();
  }

  get(key: Key) {
    let value = super.get(key);
    if (value === undefined) {
      value = this.defaultConstructor(key);
      this.set(key, value);
    }
    return value;
  }
}
