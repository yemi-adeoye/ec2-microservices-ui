export interface ICacheService {

  /**
   * String key and corresponsding val to be persisted to cache
   * @param key
   * @param value
   */
  setItem(key: string, value: any): void;

  /**
   * Stores one or mote items to cache
   * @param object an object with key value pairs to be persisted to cache
   */
  setItems(itemsObject: object): void

  /**
   * Gets one item from the cache for the supplied key
   * @param key the key to search for from the cache
   */
  getItem(key: string): any

  /**
   * Gets a set of items from the cache
   * @param keys of objects to get from the cache
   */
  getItems(keys: string[]): object;
}
