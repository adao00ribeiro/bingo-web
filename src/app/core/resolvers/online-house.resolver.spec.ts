import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { onlineHouseResolver } from './online-house.resolver';

describe('onlineHouseResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => onlineHouseResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
