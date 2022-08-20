import { TestBed } from '@angular/core/testing';

import { RequiresAuthGuard } from './requires-auth.guard';

describe('RequiresAuthGuard', () => {
  let guard: RequiresAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RequiresAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
