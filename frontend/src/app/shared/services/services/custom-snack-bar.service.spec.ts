import { TestBed } from '@angular/core/testing';

import { CustomSnackBarService } from './custom-snack-bar.service';

describe('CustomSnackBarService', () => {
  let service: CustomSnackBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomSnackBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
