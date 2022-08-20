import { TestBed } from '@angular/core/testing';

import { RequiresUnauthGuard } from './requires-unauth.guard';

describe('RequiresUnauthGuard', () => {
  let guard: RequiresUnauthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RequiresUnauthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
