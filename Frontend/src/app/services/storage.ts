import { Injectable } from '@angular/core';
import { STORAGE_KEYS } from '../constants/storage.constants';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private get(key: string): string | null {
    return localStorage.getItem(key);
  }

  private set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  private remove(key: string): void {
    localStorage.removeItem(key);
  }

  getAccessToken(): string | null {
    return this.get(STORAGE_KEYS.ACCESS_TOKEN);
  }

  setAccessToken(token: string): void {
    this.set(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  getRefreshToken(): string | null {
    return this.get(STORAGE_KEYS.REFRESH_TOKEN);
  }

  setRefreshToken(token: string): void {
    this.set(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  getUser<T>(): T | null {
    const user = this.get(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  }

  setUser(user: unknown): void {
    this.set(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  clear(): void {
    this.remove(STORAGE_KEYS.ACCESS_TOKEN);
    this.remove(STORAGE_KEYS.REFRESH_TOKEN);
    this.remove(STORAGE_KEYS.USER);
  }
}
