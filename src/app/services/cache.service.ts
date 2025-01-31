import { Injectable } from '@angular/core';
import { ICacheService } from './cache.interface.service';

@Injectable({
  providedIn: 'root'
})
export class CacheService implements ICacheService {


  setItem(key: string, value: any): void {
    localStorage.setItem(key, value);
  }


  setItems(itemsObject: any): void {
    Object.keys(itemsObject).forEach((key: string) => localStorage.setItem(key, itemsObject[key]))
  }

  getItem(key: string): string {
    return localStorage.getItem(key) || ''
  }

  getItems(keys: string[]): any {
    type CacheItem = {
      [key: string]: any
    }

    const obj: CacheItem = {}

    keys.forEach((key: any) => obj[key.toString()] = localStorage.getItem(key))

    return obj;
  }
}
