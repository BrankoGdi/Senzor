import { TestBed } from '@angular/core/testing';

import { SenzorApiService } from './senzor-api.service';

describe('SenzorApiService', () => {
  let service: SenzorApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SenzorApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
