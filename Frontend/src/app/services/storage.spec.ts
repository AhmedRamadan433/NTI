import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and retrieve access token', () => {
    service.setAccessToken('test-token');
    expect(service.getAccessToken()).toBe('test-token');
  });

  it('should clear tokens', () => {
    service.setAccessToken('test-token');
    service.setRefreshToken('refresh-token');
    service.clear();
    expect(service.getAccessToken()).toBeNull();
    expect(service.getRefreshToken()).toBeNull();
  });
});
