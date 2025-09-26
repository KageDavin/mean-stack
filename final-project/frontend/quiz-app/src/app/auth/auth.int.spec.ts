import { TestBed } from '@angular/core/testing';

import { AuthInt } from './auth.int';

describe('AuthInt', () => {
  let service: AuthInt;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthInt);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
